import { Globe } from 'lucide-react'
import {
  Building2,
  Code2,
  Image as ImageIcon,
  Mail,
  Map as MapIcon,
  MessageCircle,
  MessagesSquare,
  Newspaper,
  PenLine,
  Search,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const MAP: Record<string, LucideIcon> = {
  search: Search,
  code: Code2,
  message: MessageCircle,
  forum: MessagesSquare,
  mail: Mail,
  image: ImageIcon,
  news: Newspaper,
  building: Building2,
  pen: PenLine,
  map: MapIcon,
}

export function SiteIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Globe
  return <Icon className={className} />
}
