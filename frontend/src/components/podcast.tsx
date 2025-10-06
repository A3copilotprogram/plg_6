"use client"

import { useEffect, useRef, useState, useTransition } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Trash2 } from 'lucide-react'
import { PodcastUI } from '@/lib/podcast-ui'

type Podcast = {
  id: string
  course_id: string
  title: string
  transcript: string
  audio_path: string
  storage_backend: string
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function PodcastPlayer({ podcastId, title, transcript, onDeleted }: { podcastId: string; title: string; transcript: string; onDeleted: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [src, setSrc] = useState<string>(`/api/v1/podcasts/audio/${podcastId}`)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [resolving, setResolving] = useState(false)

  // Resolve S3 presigned URL if backend returns JSON
  async function resolveAudioSrc() {
    try {
      setResolving(true)
      const res = await fetch(`/api/v1/podcasts/audio/${podcastId}`, {
        // Encourage JSON path for S3 presign; local stream will ignore this
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await res.json().catch(() => ({} as any))
        if (data?.url) setSrc(data.url)
      } else {
        // Fallback to route-streaming
        setSrc(`/api/v1/podcasts/audio/${podcastId}`)
      }
    } catch {
      setSrc(`/api/v1/podcasts/audio/${podcastId}`)
    } finally {
      setResolving(false)
    }
  }

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setCurrentTime(a.currentTime)
    const onLoaded = () => setDuration(a.duration || 0)
    const onEnded = () => setIsPlaying(false)
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onLoaded)
    a.addEventListener('ended', onEnded)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onLoaded)
      a.removeEventListener('ended', onEnded)
    }
  }, [])

  const togglePlay = async () => {
    if (!audioRef.current) return
    if (!src || src.endsWith(`/api/v1/podcasts/audio/${podcastId}`)) {
      // Attempt to resolve S3 URL just-in-time
      await resolveAudioSrc()
    }
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch {
        // try once more after resolution
        await resolveAudioSrc()
        await audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const seek = (value: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = value
    setCurrentTime(value)
  }

  const step = (delta: number) => {
    if (!audioRef.current) return
    const next = Math.max(0, Math.min((audioRef.current.duration || 0), audioRef.current.currentTime + delta))
    audioRef.current.currentTime = next
    setCurrentTime(next)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !audioRef.current.muted
    setMuted(audioRef.current.muted)
  }

  const changeVolume = (v: number) => {
    if (!audioRef.current) return
    audioRef.current.volume = v
    setVolume(v)
    if (v > 0 && audioRef.current.muted) {
      audioRef.current.muted = false
      setMuted(false)
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-slate-200 p-4 bg-white/50">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold truncate">{title}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => step(-15)} className="p-2 rounded hover:bg-slate-100" aria-label="Back 15s">
            <SkipBack className="h-5 w-5" />
          </button>
          <button onClick={togglePlay} disabled={resolving} className="p-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50" aria-label="Play/Pause">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button onClick={() => step(15)} className="p-2 rounded hover:bg-slate-100" aria-label="Forward 15s">
            <SkipForward className="h-5 w-5" />
          </button>
          <button
            onClick={async () => {
              if (!confirm('Delete this podcast?')) return
              try {
                await PodcastUI.delete(podcastId)
                onDeleted()
              } catch (e) {
                // ignore UI errors; a toast could be added here
              }
            }}
            className="p-2 rounded hover:bg-red-50 text-red-600"
            aria-label="Delete podcast"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 w-40">
          <button onClick={toggleMute} className="p-2 rounded hover:bg-slate-100" aria-label="Mute">
            {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="w-full accent-cyan-600"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => seek(parseFloat(e.target.value))}
          className="w-full accent-cyan-600"
        />
        <span className="text-xs tabular-nums w-10">{formatTime(duration)}</span>
      </div>

      <details className="mt-3 text-sm text-slate-600">
        <summary>Transcript</summary>
        <pre className="whitespace-pre-wrap mt-2">{transcript}</pre>
      </details>

      {/* hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  )
}

type DocItem = { id: string; title?: string; filename?: string; status?: string }

export default function PodcastComponent({ courseId }: { courseId: string }) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [title, setTitle] = useState('')
  const [isPending, startTransition] = useTransition()
  const [teacherVoice, setTeacherVoice] = useState('coral')
  const [studentVoice, setStudentVoice] = useState('alloy')
  const [mode, setMode] = useState<'dialogue' | 'presentation'>('dialogue')
  const [topics, setTopics] = useState('')
  const [documents, setDocuments] = useState<DocItem[]>([])
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchList() {
    try {
      setLoading(true)
      const json = await PodcastUI.list(courseId)
      setPodcasts(json.data ?? [])
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    ;(async () => {
      try {
        const r = await fetch(`/api/v1/documents/by-course/${courseId}`, { cache: 'no-store' })
        const j = await r.json()
        setDocuments(Array.isArray(j) ? j : [])
      } catch {
        setDocuments([])
      }
    })()
  }, [courseId])

  function handleGenerate() {
    startTransition(async () => {
      setError(null)
      try {
        if (!title.trim()) {
          setError('Title is required')
          return
        }
        await PodcastUI.generate(courseId, {
          title,
          mode,
          topics: topics || undefined,
          teacher_voice: mode === 'dialogue' ? teacherVoice : undefined,
          student_voice: mode === 'dialogue' ? studentVoice : undefined,
          narrator_voice: mode === 'presentation' ? teacherVoice : undefined,
          document_ids: selectedDocs.length ? selectedDocs : undefined,
        })
        await fetchList()
        
        // Clear form fields after successful generation
        setTitle('')
        setTopics('')
        setSelectedDocs([])
      } catch (e) {
        setError((e as Error).message)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <input
          className="px-3 py-2 border rounded w-64"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Podcast title"
        />
        <ModeSelect mode={mode} onChange={setMode} />
        {mode === 'dialogue' ? (
          <>
            <VoiceSelect label="Teacher voice" value={teacherVoice} onChange={setTeacherVoice} />
            <VoiceSelect label="Student voice" value={studentVoice} onChange={setStudentVoice} />
          </>
        ) : (
          <VoiceSelect label="Narrator voice" value={teacherVoice} onChange={setTeacherVoice} />
        )}
        <button
          onClick={handleGenerate}
          disabled={isPending || !title.trim()}
          className="px-4 py-2 bg-cyan-600 text-white rounded disabled:opacity-50"
        >
          {isPending ? 'Generating…' : 'Generate Podcast'}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-slate-700">Focus topics (optional)</label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="e.g., Focus on Chapters 2–3: core concepts, examples, and key takeaways"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
        />
      </div>
      {documents.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-700">Limit to documents (optional)</label>
          <div className="flex flex-wrap gap-3">
            {documents.map((d) => {
              const id = d.id
              const label = d.title || d.filename || id
              const checked = selectedDocs.includes(id)
              return (
                <label key={id} className="flex items-center gap-2 border rounded px-2 py-1">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      setSelectedDocs((prev) =>
                        e.target.checked ? [...prev, id] : prev.filter((x) => x !== id)
                      )
                    }}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : podcasts.length === 0 ? (
        <div className="text-slate-500">No podcasts yet.</div>
      ) : (
        <ul className="space-y-4">
          {podcasts.map((p) => (
            <li key={p.id} className="border rounded p-4">
              <PodcastPlayer podcastId={p.id} title={p.title} transcript={p.transcript} onDeleted={fetchList} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function VoiceSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const voices = [
    'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer',
    'coral', 'verse', 'ballad', 'ash', 'sage', 'marin', 'cedar',
  ]
  return (
    <label className="text-sm text-slate-700 flex items-center gap-2">
      <span>{label}</span>
      <select className="border rounded px-2 py-1" value={value} onChange={(e) => onChange(e.target.value)}>
        {voices.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    </label>
  )
}
function ModeSelect({ mode, onChange }: { mode: 'dialogue' | 'presentation'; onChange: (m: 'dialogue' | 'presentation') => void }) {
  return (
    <label className="text-sm text-slate-700 flex items-center gap-2">
      <span>Mode</span>
      <select className="border rounded px-2 py-1" value={mode} onChange={(e) => onChange(e.target.value as any)}>
        <option value="dialogue">Dialogue (Teacher/Student)</option>
        <option value="presentation">Presentation (Narrator)</option>
      </select>
    </label>
  )
}
