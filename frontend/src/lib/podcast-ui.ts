/** Client-side helpers that call our Next.js API routes. */

export type GenerateBody = {
  title?: string
  mode?: 'dialogue' | 'presentation'
  topics?: string
  teacher_voice?: string
  student_voice?: string
  narrator_voice?: string
  document_ids?: string[]
}

export const PodcastUI = {
  async list(courseId: string) {
    const res = await fetch(`/api/v1/podcasts/${courseId}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async generate(courseId: string, body: GenerateBody) {
    const res = await fetch(`/api/v1/podcasts/${courseId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async delete(podcastId: string) {
    const res = await fetch(`/api/v1/podcasts/by-id/${podcastId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
}

