import { BadgeCheck, GitBranch, Archive, Star, MapPin, CalendarDays } from 'lucide-react'
import type { PostData, PhotoData, ProfilePageData, Website } from '../../data/types'
import { RichView } from '../rich/RichView'
import { Photo } from '../photo/Photo'
import { hashSeed } from '../../lib/hash'

function Avatar({ seed, name, size = 'size-14' }: { seed: string; name: string; size?: string }) {
  const hue = hashSeed(seed) % 360
  const initials = name
    .split(' ')
    .map((x) => x[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full font-bold text-white shadow-inner`}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 42%), hsl(${(hue + 50) % 360} 55% 28%))` }}
    >
      <span className="text-lg">{initials}</span>
    </div>
  )
}

function Geotag({ geotag }: { geotag: NonNullable<PhotoData['geotag']> }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-300">
      <MapPin className="size-3" />
      {geotag.label}
    </span>
  )
}

function PostCard({ post }: { post: PostData }) {
  return (
    <article className="rounded-xl border border-white/5 bg-zinc-900/50 p-4 transition-colors hover:border-white/10">
      <div className="flex items-center gap-3">
        <Avatar seed={post.handle} name={post.author} size="size-10" />
        <div>
          <div className="flex items-center gap-1 text-sm font-semibold text-zinc-100">
            {post.author}
            <BadgeCheck className="size-3.5 text-sky-400" />
          </div>
          <div className="text-xs text-zinc-500">
            {post.handle} · {post.time}
          </div>
        </div>
      </div>

      {post.replyTo && (
        <div className="mt-3 rounded-lg border-l-2 border-zinc-700 bg-zinc-950/60 px-3 py-2 text-sm">
          <div className="text-xs font-medium text-zinc-500">Válasz erre: {post.replyTo.handle}</div>
          <div className="mt-1 text-zinc-400">
            <RichView segs={post.replyTo.body} />
          </div>
        </div>
      )}

      <p className="mt-3 text-[15px] leading-relaxed text-zinc-200">
        <RichView segs={post.body} />
      </p>

      {post.photo && <PhotoBlock photo={post.photo} />}

      {typeof post.likes === 'number' && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500">
          <Star className="size-3.5" /> {post.likes} kedvelés
        </div>
      )}
    </article>
  )
}

function PhotoBlock({ photo }: { photo: PhotoData }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-white/5">
      <Photo photo={photo} className="max-h-72 w-full" />
      <div className="space-y-2 bg-zinc-950/60 px-3 py-2">
        {photo.caption && (
          <div className="text-sm text-zinc-300">
            <RichView segs={photo.caption} />
          </div>
        )}
        {photo.geotag && <Geotag geotag={photo.geotag} />}
      </div>
    </div>
  )
}

export function ProfilePage({ page, site }: { page: ProfilePageData; site: Website }) {
  return (
    <div className="animate-fade-in">
      <div
        className={`h-28 rounded-t-xl border-b border-white/10 ${
          page.variant === 'dev'
            ? 'bg-gradient-to-r from-emerald-900/60 via-zinc-900 to-zinc-900'
            : 'bg-gradient-to-r from-sky-900/60 via-zinc-900 to-zinc-900'
        }`}
      />
      <div className="-mt-10 px-5">
        <div className="flex items-end gap-4">
          <div className="rounded-full border-4 border-zinc-950">
            <Avatar seed={page.avatarSeed} name={page.displayName} size="size-24" />
          </div>
          <div className="pb-1">
            <h1 className="text-2xl font-bold text-zinc-50">{page.displayName}</h1>
            <div className="font-mono text-sm text-zinc-500">{page.handle}</div>
          </div>
          <div className="ml-auto pb-1 text-right text-xs text-zinc-600">
            <div className="flex items-center justify-end gap-1">
              <span className={`font-semibold ${site.accent}`}>{site.name}</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[15px] text-zinc-300">
          <RichView segs={page.bio} />
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-zinc-500">
          {page.meta.map((m) => (
            <span key={m.label} className="inline-flex items-center gap-1.5">
              <span className="font-semibold text-zinc-400">{m.label}:</span>
              <RichView segs={m.value} />
            </span>
          ))}
          {page.variant === 'social' && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" /> 2014 óta tag
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3 px-5 pb-8">
        {page.repos?.map((r) => (
          <div key={r.name} className="rounded-xl border border-white/5 bg-zinc-900/50 p-4 transition-colors hover:border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <GitBranch className="size-4 text-zinc-500" />
              <span className="font-mono text-sm font-semibold text-zinc-100">{r.name}</span>
              {r.archived && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-300">
                  <Archive className="size-3" /> archiválva
                </span>
              )}
              <span className="ml-auto text-xs text-zinc-500">{r.updated}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              <RichView segs={r.desc} />
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5" /> {r.stars}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-sky-400" /> {r.lang}
              </span>
            </div>
          </div>
        ))}

        {page.posts?.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  )
}

export { Avatar, PhotoBlock, Geotag }
