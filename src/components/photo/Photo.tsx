import { useMemo } from 'react'
import type { PhotoData } from '../../data/types'
import { mulberry32, hashSeed } from '../../lib/hash'

type El = React.ReactElement

/** Determinisztikus, generált SVG „fotó” – teljesen offline. */
export function Photo({ photo, className }: { photo: PhotoData; className?: string }) {
  const content = useMemo(() => renderPhoto(photo), [photo])
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" preserveAspectRatio="xMidYMid slice">
      {content}
    </svg>
  )
}

function renderPhoto(photo: PhotoData): El[] {
  const rnd = mulberry32(hashSeed(photo.id))
  const id = photo.id
  const els: El[] = []
  const key = (n: string) => `${id}-${n}`

  const palettes: Record<string, [string, string, string]> = {
    landscape: ['#bae6fd', '#0c4a6e', '#14532d'],
    lake: ['#7dd3fc', '#164e63', '#134e4a'],
    cabin: ['#fdba74', '#7c2d12', '#3f2712'],
    city: ['#c4b5fd', '#1e1b4b', '#312e81'],
    night: ['#1e293b', '#020617', '#0f172a'],
    train: ['#93c5fd', '#1e3a8a', '#166534'],
    portrait: ['#4c1d95', '#0f0a1e', '#1e1b4b'],
    abstract: ['#f0abfc', '#3b0764', '#701a75'],
    office: ['#e2e8f0', '#334155', '#475569'],
  }
  const [skyTop, skyBot, ground] = palettes[photo.kind] ?? palettes.abstract

  els.push(
    <defs key={key('defs')}>
      <linearGradient id={key('sky')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={skyTop} />
        <stop offset="1" stopColor={skyBot} />
      </linearGradient>
    </defs>,
    <rect key={key('skyrect')} width="400" height="300" fill={`url(#${key('sky')})`} />,
  )

  const hill = (y: number, amp: number, color: string, k: string) => {
    let d = `M0 ${y}`
    for (let x = 0; x <= 400; x += 50) {
      d += ` Q ${x + 25} ${y - rnd() * amp} ${x + 50} ${y}`
    }
    d += ` L400 300 L0 300 Z`
    return <path key={key(k)} d={d} fill={color} />
  }

  const tree = (x: number, y: number, s: number, k: string) => (
    <g key={key(k)}>
      <rect x={x - 1.5} y={y - 8 * s} width="3" height={8 * s} fill="#292524" />
      <polygon points={`${x},${y - 26 * s} ${x - 7 * s},${y - 6 * s} ${x + 7 * s},${y - 6 * s}`} fill="#166534" />
      <polygon points={`${x},${y - 34 * s} ${x - 5 * s},${y - 16 * s} ${x + 5 * s},${y - 16 * s}`} fill="#15803d" />
    </g>
  )

  const cabin = (x: number, y: number, s: number, k: string) => (
    <g key={key(k)}>
      <rect x={x - 16 * s} y={y - 16 * s} width={32 * s} height={16 * s} fill="#44403c" />
      <polygon points={`${x},${y - 28 * s} ${x - 20 * s},${y - 16 * s} ${x + 20 * s},${y - 16 * s}`} fill="#57534e" />
      <rect x={x + 6 * s} y={y - 26 * s} width={4 * s} height={6 * s} fill="#78716c" />
      <rect x={x - 8 * s} y={y - 12 * s} width={7 * s} height={7 * s} fill="#fbbf24" opacity="0.9" />
    </g>
  )

  switch (photo.kind) {
    case 'lake':
    case 'landscape': {
      els.push(<circle key={key('sun')} cx={80 + rnd() * 240} cy={60 + rnd() * 30} r="22" fill="#fef08a" opacity="0.9" />)
      els.push(hill(170, 40, skyBot, 'h1'))
      els.push(hill(200, 30, ground, 'h2'))
      if (photo.kind === 'lake') {
        els.push(<rect key={key('water')} y="215" width="400" height="85" fill="#0e7490" opacity="0.85" />)
        for (let i = 0; i < 5; i++) {
          const wy = 228 + i * 14
          els.push(
            <line
              key={key(`w${i}`)}
              x1={20 + rnd() * 60}
              y1={wy}
              x2={180 + rnd() * 160}
              y2={wy}
              stroke="#a5f3fc"
              strokeWidth="1.5"
              opacity="0.4"
            />,
          )
        }
      } else {
        els.push(hill(235, 20, '#052e16', 'h3'))
        for (let i = 0; i < 5; i++) tree(30 + rnd() * 340, 240 + rnd() * 15, 0.8 + rnd() * 0.6, `t${i}`)
      }
      break
    }
    case 'cabin': {
      els.push(<circle key={key('sun')} cx="320" cy="55" r="26" fill="#fde68a" opacity="0.9" />)
      els.push(hill(165, 35, '#3f2712', 'h1'))
      els.push(hill(205, 25, '#291a0c', 'h2'))
      els.push(cabin(200, 240, 2.4, 'cabin'))
      els.push(<rect key={key('smoke')} x="212" y="180" width="5" height="26" rx="2" fill="#a8a29e" opacity="0.7" />)
      els.push(<circle key={key('smoke2')} cx="216" cy="172" r="9" fill="#d6d3d1" opacity="0.5" />)
      els.push(<circle key={key('smoke3')} cx="224" cy="158" r="13" fill="#d6d3d1" opacity="0.3" />)
      for (let i = 0; i < 7; i++) tree(15 + rnd() * 370, 215 + rnd() * 25, 1 + rnd(), `t${i}`)
      break
    }
    case 'city': {
      for (let i = 0; i < 9; i++) {
        const bw = 30 + rnd() * 30
        const bh = 60 + rnd() * 130
        const bx = i * 45 + rnd() * 10
        els.push(<rect key={key(`b${i}`)} x={bx} y={280 - bh} width={bw} height={bh} fill="#1e1b4b" stroke="#312e81" />)
        for (let wy = 0; wy < Math.floor(bh / 22); wy++) {
          for (let wx = 0; wx < Math.floor(bw / 14); wx++) {
            if (rnd() > 0.45) {
              els.push(
                <rect
                  key={key(`w${i}-${wx}-${wy}`)}
                  x={bx + 5 + wx * 14}
                  y={288 - bh + wy * 22}
                  width="6"
                  height="9"
                  fill="#fde047"
                  opacity={0.35 + rnd() * 0.5}
                />,
              )
            }
          }
        }
      }
      break
    }
    case 'night': {
      for (let i = 0; i < 26; i++) {
        els.push(
          <circle key={key(`s${i}`)} cx={rnd() * 400} cy={rnd() * 160} r={rnd() * 1.6 + 0.4} fill="#e2e8f0" opacity={0.4 + rnd() * 0.6} />,
        )
      }
      els.push(<circle key={key('moon')} cx="330" cy="60" r="20" fill="#f1f5f9" />)
      els.push(<circle key={key('moonb')} cx="338" cy="54" r="18" fill={skyBot} />)
      els.push(hill(200, 30, '#0f172a', 'h1'))
      els.push(hill(240, 20, '#020617', 'h2'))
      break
    }
    case 'train': {
      els.push(hill(180, 25, ground, 'h1'))
      els.push(<rect key={key('railbed')} y="230" width="400" height="70" fill="#3f3f46" />)
      els.push(<line key={key('r1')} x1="0" y1="252" x2="400" y2="252" stroke="#a1a1aa" strokeWidth="3" />)
      els.push(<line key={key('r2')} x1="0" y1="272" x2="400" y2="272" stroke="#a1a1aa" strokeWidth="3" />)
      for (let i = 0; i < 3; i++) {
        const wx = 30 + i * 120
        els.push(
          <g key={key(`train${i}`)}>
            <rect x={wx} y="212" width="100" height="38" rx="6" fill="#dc2626" />
            <rect x={wx + 10} y="220" width="20" height="14" rx="2" fill="#93c5fd" />
            <rect x={wx + 40} y="220" width="20" height="14" rx="2" fill="#93c5fd" />
            <rect x={wx + 70} y="220" width="20" height="14" rx="2" fill="#93c5fd" />
          </g>,
        )
      }
      break
    }
    case 'portrait': {
      els.push(<circle key={key('glow')} cx="200" cy="130" r="90" fill="#8b5cf6" opacity="0.25" />)
      els.push(<circle key={key('head')} cx="200" cy="120" r="52" fill="#c4b5fd" opacity="0.9" />)
      els.push(<path key={key('body')} d="M120 300 Q200 190 280 300 Z" fill="#a78bfa" opacity="0.9" />)
      break
    }
    case 'office': {
      els.push(<rect key={key('wall')} x="40" y="40" width="320" height="220" rx="8" fill="#475569" opacity="0.5" />)
      for (let i = 0; i < 4; i++) {
        els.push(
          <rect
            key={key(`win${i}`)}
            x={60 + i * 80}
            y="60"
            width="60"
            height="80"
            rx="4"
            fill="#7dd3fc"
            opacity="0.5"
          />,
        )
      }
      els.push(<rect key={key('desk')} x="100" y="180" width="200" height="14" rx="4" fill="#1e293b" />)
      els.push(<rect key={key('mon')} x="150" y="140" width="70" height="44" rx="4" fill="#0f172a" stroke="#64748b" />)
      break
    }
    default: {
      for (let i = 0; i < 6; i++) {
        els.push(
          <circle
            key={key(`c${i}`)}
            cx={rnd() * 400}
            cy={rnd() * 300}
            r={20 + rnd() * 60}
            fill={i % 2 ? '#f0abfc' : '#22d3ee'}
            opacity={0.12 + rnd() * 0.2}
          />,
        )
      }
      els.push(
        <path
          key={key('stroke')}
          d={`M0 ${100 + rnd() * 100} C 120 ${rnd() * 300}, 280 ${rnd() * 300}, 400 ${100 + rnd() * 100}`}
          stroke="#fdf4ff"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />,
      )
    }
  }

  // sötét vignetta, hogy „fényképes” legyen a hangulat
  els.push(
    <rect key={key('vig')} width="400" height="300" fill="black" opacity="0.08" />,
  )
  return els
}
