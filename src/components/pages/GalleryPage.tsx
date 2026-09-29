import { useState } from 'react'
import { Camera, MapPin, MessageSquare, X } from 'lucide-react'
import type { GalleryPageData, PhotoData, Website } from '../../data/types'
import { RichView } from '../rich/RichView'
import { Photo } from '../photo/Photo'
import { Modal } from '../ui/Modal'

function Caption({ photo }: { photo: PhotoData }) {
  return (
    <div className="space-y-2 px-3 py-2.5">
      {photo.caption && (
        <div className="text-sm leading-relaxed text-zinc-300">
          <RichView segs={photo.caption} />
        </div>
      )}
      {photo.geotag && (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-300">
          <MapPin className="size-3" />
          {photo.geotag.label}
        </span>
      )}
    </div>
  )
}

export function GalleryPage({ page, site }: { page: GalleryPageData; site: Website }) {
  const [zoom, setZoom] = useState<PhotoData | null>(null)
  const selected = zoom ? page.photos.find((p) => p.id === zoom.id) ?? zoom : null

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Camera className={`size-6 ${site.accent}`} />
        <div>
          <h1 className="text-xl font-bold text-zinc-50">{page.album}</h1>
          <div className="text-xs text-zinc-500">
            {page.owner} fotói · {page.photos.length} kép
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 pb-8 sm:grid-cols-2">
        {page.photos.map((ph) => (
          <button
            key={ph.id}
            onClick={() => setZoom(ph)}
            className="group cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50 text-left transition-all hover:border-white/15 hover:shadow-lg hover:shadow-black/40"
          >
            <Photo photo={ph} className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.02]" />
            <div className="border-t border-white/5">
              <Caption photo={ph} />
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setZoom(null)} className="max-w-2xl">
        {selected && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-100">{page.album}</h3>
              <button
                onClick={() => setZoom(null)}
                className="cursor-pointer text-zinc-500 transition-colors hover:text-zinc-200"
              >
                <X className="size-5" />
              </button>
            </div>
            <Photo photo={selected} className="w-full rounded-lg" />
            <Caption photo={selected} />
            {selected.comments && selected.comments.length > 0 && (
              <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                  <MessageSquare className="size-3.5" /> Hozzászólások
                </div>
                {selected.comments.map((cm, i) => (
                  <div key={i} className="rounded-lg bg-zinc-900/70 px-3 py-2 text-sm">
                    <span className="font-semibold text-zinc-200">{cm.author}</span>
                    <span className="text-zinc-400">: </span>
                    <RichView segs={cm.body} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
