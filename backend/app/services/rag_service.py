"""
RAG (Retrieval-Augmented Generation) service for document context retrieval
"""
import logging
import uuid
from typing import List, Optional

from app.api.routes.documents import (
    async_openai_client,
    EMBEDDING_MODEL,
    index_name,
    pc,
)

logger = logging.getLogger(__name__)

async def get_question_embedding(question: str) -> List[float]:
    """Generate embedding for a question"""
    embed_resp = await async_openai_client.embeddings.create(
        input=[question],
        model=EMBEDDING_MODEL,
    )
    embedding = embed_resp.data[0].embedding
    return embedding


async def retrieve_relevant_context(
    question_embedding: List[float],
    course_id: uuid.UUID,
    top_k: int = 5,
    document_ids: Optional[List[uuid.UUID]] = None,
) -> Optional[str]:
    """
    Retrieve relevant context from course documents using vector similarity
    
    Args:
        question_embedding: The embedding vector for the question
        course_id: UUID of the course to search within
        top_k: Number of top matches to retrieve
        
    Returns:
        Concatenated context string or None if no relevant content found
    """
    try:
        # Ensure index exists and log setup
        has_idx = pc.has_index(index_name)
        if not has_idx:
            logger.warning("[RAG] Index %s does not exist before query", index_name)

        # Query Pinecone for relevant chunks
        index = pc.Index(index_name)
        pine_filter: dict = {"course_id": {"$eq": str(course_id)}}
        if document_ids:
            pine_filter["document_id"] = {"$in": [str(d) for d in document_ids]}
        query_result = index.query(
            vector=question_embedding,
            filter=pine_filter,
            top_k=top_k,
            include_metadata=True,
        )

        # Pinecone may return either an object or dict-like structure
        matches = query_result.get("matches", []) if hasattr(query_result, "get") else getattr(query_result, "matches", [])

        contexts: List[str] = []
        if matches:
            for i, m in enumerate(matches[:min(5, len(matches))]):
                # tolerate different shapes (dict or object)
                score = m.get("score") if isinstance(m, dict) else getattr(m, "score", None)
                metadata = m.get("metadata") if isinstance(m, dict) else getattr(m, "metadata", {})
                text = metadata.get("text") if isinstance(metadata, dict) else None
                cid = metadata.get("course_id") if isinstance(metadata, dict) else None
                did = metadata.get("document_id") if isinstance(metadata, dict) else None
                contexts.append(text) if text else None

        if not contexts:
            # Additional debug: try an unfiltered query to inspect stored metadata
            try:
                probe = index.query(
                    vector=question_embedding,
                    top_k=1,
                    include_metadata=True,
                )
                probe_matches = probe.get("matches", []) if hasattr(probe, "get") else getattr(probe, "matches", [])
                if probe_matches:
                    pm = probe_matches[0]
                    pmeta = pm.get("metadata") if isinstance(pm, dict) else getattr(pm, "metadata", {})
                    # Fallback: if vectors exist but filter produced none, try manual filtering in code
                    # to guard against filter-shape mismatches across SDK versions
                    fallback = index.query(
                        vector=question_embedding,
                        top_k=max(10, top_k),
                        include_metadata=True,
                    )
                    fb_matches = fallback.get("matches", []) if hasattr(fallback, "get") else getattr(fallback, "matches", [])
                    fb_contexts: List[str] = []
                    for m in fb_matches:
                        md = m.get("metadata") if isinstance(m, dict) else getattr(m, "metadata", {})
                        text = md.get("text") if isinstance(md, dict) else None
                        cid = md.get("course_id") if isinstance(md, dict) else None
                        if text and str(cid) == str(course_id):
                            fb_contexts.append(text)
                    if fb_contexts:
                        merged_fb = "\n\n".join(fb_contexts[:top_k])
                        return merged_fb
            except Exception as pe:
                logger.exception("[RAG] Probe query failed: %s", pe)
            logger.warning(
                "[RAG] No contexts found from Pinecone | index=%s | course_id=%s",
                index_name,
                str(course_id),
            )
            return None

        merged = "\n\n".join(contexts)
        return merged

    except Exception as e:
        logger.exception("[RAG] Error retrieving context from Pinecone: %s", e)
        return None
