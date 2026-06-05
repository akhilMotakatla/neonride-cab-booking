import { useEffect, useRef } from 'react'

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Star { x:number; y:number; z:number; color:string }
interface Cube {
  x:number; y:number; z:number
  rx:number; ry:number; rz:number
  drx:number; dry:number; drz:number
  size:number; color:string; alpha:number
}
interface Ring { r:number; alpha:number; color:string }

const COLORS = ['#00F2FE','#4FACFE','#7B61FF','#00F2FE','#4FACFE','#F5C842']
const FOV    = 300
const MAX_Z  = 900

/* ─── Rotation helpers ───────────────────────────────────────────────── */
function rx(x:number,y:number,z:number,a:number):[number,number,number]{
  return [x, y*Math.cos(a)-z*Math.sin(a), y*Math.sin(a)+z*Math.cos(a)]
}
function ry(x:number,y:number,z:number,a:number):[number,number,number]{
  return [x*Math.cos(a)+z*Math.sin(a), y, -x*Math.sin(a)+z*Math.cos(a)]
}
function rz(x:number,y:number,z:number,a:number):[number,number,number]{
  return [x*Math.cos(a)-y*Math.sin(a), x*Math.sin(a)+y*Math.cos(a), z]
}
function proj(px:number,py:number,pz:number,cx:number,cy:number){
  const s = FOV / Math.max(pz, 1)
  return { sx: px*s+cx, sy: py*s+cy }
}

/* ─── Cube geometry ──────────────────────────────────────────────────── */
const VERTS:[number,number,number][] = [
  [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
  [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1],
]
const EDGES = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]

function drawCube(ctx:CanvasRenderingContext2D, c:Cube, cx:number, cy:number){
  const pts = VERTS.map(([vx,vy,vz]) => {
    let p:[number,number,number] = [vx*c.size, vy*c.size, vz*c.size]
    p = rx(...p, c.rx); p = ry(...p, c.ry); p = rz(...p, c.rz)
    return [p[0]+c.x, p[1]+c.y, p[2]+c.z] as [number,number,number]
  })
  ctx.strokeStyle = c.color
  ctx.globalAlpha = c.alpha
  ctx.lineWidth   = 0.8
  ctx.shadowColor = c.color
  ctx.shadowBlur  = 6
  for (const [a,b] of EDGES){
    if (pts[a][2] < 20 || pts[b][2] < 20) continue
    const pa = proj(...pts[a], cx, cy)
    const pb = proj(...pts[b], cx, cy)
    ctx.beginPath(); ctx.moveTo(pa.sx, pa.sy); ctx.lineTo(pb.sx, pb.sy); ctx.stroke()
  }
  ctx.globalAlpha = 1; ctx.shadowBlur = 0
}

/* ─── Component ──────────────────────────────────────────────────────── */
export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId = 0
    let w = window.innerWidth
    let h = window.innerHeight
    let cx = w/2, cy = h/2
    let gridOff = 0
    let time    = 0

    /* Resize — always use window dims as safe fallback */
    const resize = () => {
      w = canvas.offsetWidth  || window.innerWidth
      h = canvas.offsetHeight || window.innerHeight
      if (w < 10) w = window.innerWidth
      if (h < 10) h = window.innerHeight
      canvas.width  = w
      canvas.height = h
      cx = w/2; cy = h/2
    }
    resize()
    window.addEventListener('resize', resize)

    /* Stars */
    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: (Math.random()-.5)*1600,
      y: (Math.random()-.5)*1000,
      z: Math.random()*MAX_Z + 50,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
    }))

    /* Cubes */
    const cubes: Cube[] = Array.from({ length: 12 }, () => ({
      x:(Math.random()-.5)*700, y:(Math.random()-.5)*400, z:Math.random()*500+180,
      rx:Math.random()*6.28, ry:Math.random()*6.28, rz:Math.random()*6.28,
      drx:(Math.random()-.5)*0.007, dry:(Math.random()-.5)*0.008, drz:(Math.random()-.5)*0.006,
      size:Math.random()*20+10,
      color:COLORS[Math.floor(Math.random()*COLORS.length)],
      alpha:Math.random()*0.35+0.12,
    }))

    /* Rings */
    const rings: Ring[] = COLORS.slice(0,5).map(() => ({
      r: Math.random()*400, alpha:0, color:COLORS[Math.floor(Math.random()*COLORS.length)]
    }))

    /* Draw */
    const draw = () => {
      time += 0.016; gridOff = (gridOff + 1.3) % 60

      /* ── background ── */
      const maxDim = Math.max(w, h)
      const bgG = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDim * 0.85)
      bgG.addColorStop(0, '#0b1528')
      bgG.addColorStop(0.6, '#060c1a')
      bgG.addColorStop(1, '#020408')
      ctx.fillStyle = bgG
      ctx.fillRect(0, 0, w, h)

      /* ── pulsing rings ── */
      for (const ring of rings) {
        ring.r += 0.9
        ring.alpha = Math.max(0, 0.3*(1 - ring.r/500))
        if (ring.r > 500) { ring.r = 0; ring.alpha = 0.3 }
        if (ring.r < 2) continue
        ctx.beginPath()
        ctx.arc(cx, cy, ring.r, 0, Math.PI*2)
        ctx.strokeStyle = ring.color
        ctx.globalAlpha = ring.alpha
        ctx.lineWidth   = 1.5
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      /* ── warp stars ── */
      for (const s of stars) {
        const prevZ = s.z
        s.z -= 3.5
        if (s.z < 1) {
          s.z = MAX_Z; s.x = (Math.random()-.5)*1600; s.y = (Math.random()-.5)*1000; continue
        }
        const pa = proj(s.x, s.y, prevZ, cx, cy)
        const pb = proj(s.x, s.y, s.z,   cx, cy)
        const depth = 1 - s.z/MAX_Z
        ctx.globalAlpha = Math.min(1, depth*1.5)
        ctx.strokeStyle = s.color
        ctx.shadowColor = s.color
        ctx.shadowBlur  = depth*4
        ctx.lineWidth   = Math.max(0.3, depth*2)
        ctx.beginPath(); ctx.moveTo(pa.sx, pa.sy); ctx.lineTo(pb.sx, pb.sy); ctx.stroke()
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0

      /* ── perspective grid ── */
      const gy = h * 0.62
      const HLINES = 10, VLINES = 16
      ctx.save()
      for (let i = 1; i <= HLINES; i++) {
        const t = i/HLINES
        const y = gy + (h-gy)*(t*t)
        const xw = (w*0.52)*t
        ctx.strokeStyle = `rgba(0,242,254,${t*0.18})`
        ctx.lineWidth = 0.7
        ctx.beginPath(); ctx.moveTo(cx-xw, y); ctx.lineTo(cx+xw, y); ctx.stroke()
      }
      for (let i = -VLINES/2; i <= VLINES/2; i++) {
        const xBot = cx + i*(w*0.52/(VLINES/2))
        ctx.strokeStyle = 'rgba(0,242,254,0.1)'
        ctx.lineWidth = 0.6
        ctx.beginPath(); ctx.moveTo(cx, gy); ctx.lineTo(xBot, h+10); ctx.stroke()
      }
      /* scrolling accent line */
      for (let i = 0; i < HLINES*2; i++) {
        const t = ((i/(HLINES*2)) + gridOff/120) % 1
        const y = gy + (h-gy)*(t*t)
        const xw = (w*0.52)*t
        const a = t*0.35*Math.sin(t*Math.PI)
        if (a < 0.01) continue
        ctx.strokeStyle = `rgba(79,172,254,${a})`
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(cx-xw, y); ctx.lineTo(cx+xw, y); ctx.stroke()
      }
      ctx.restore()

      /* ── horizon glow ── */
      const hgG = ctx.createLinearGradient(0, gy-50, 0, gy+30)
      hgG.addColorStop(0, 'transparent')
      hgG.addColorStop(0.5, 'rgba(0,242,254,0.05)')
      hgG.addColorStop(1, 'transparent')
      ctx.fillStyle = hgG
      ctx.fillRect(0, gy-50, w, 80)

      /* ── wireframe cubes ── */
      for (const cube of cubes) {
        cube.rx += cube.drx; cube.ry += cube.dry; cube.rz += cube.drz
        cube.z  -= 0.22
        if (cube.z < 80) {
          cube.z = 650; cube.x = (Math.random()-.5)*700; cube.y = (Math.random()-.5)*400
        }
        drawCube(ctx, cube, cx, cy)
      }

      /* ── slow rotating light beams ── */
      ctx.save(); ctx.globalAlpha = 0.035
      for (let i = 0; i < 6; i++) {
        const angle = (i/6)*Math.PI*2 + time*0.06
        const grd = ctx.createLinearGradient(cx, cy, cx+Math.cos(angle)*w, cy+Math.sin(angle)*h)
        grd.addColorStop(0, '#00F2FE'); grd.addColorStop(1, 'transparent')
        ctx.strokeStyle = grd; ctx.lineWidth = 28
        ctx.beginPath(); ctx.moveTo(cx, cy)
        ctx.lineTo(cx+Math.cos(angle)*w, cy+Math.sin(angle)*h); ctx.stroke()
      }
      ctx.restore()

      /* ── moving scanline ── */
      const sy = ((time*50) % (h+30)) - 15
      const sgG = ctx.createLinearGradient(0, sy, 0, sy+30)
      sgG.addColorStop(0, 'transparent'); sgG.addColorStop(0.5, 'rgba(0,242,254,0.025)'); sgG.addColorStop(1, 'transparent')
      ctx.fillStyle = sgG; ctx.fillRect(0, sy, w, 30)

      /* ── vignette ── */
      const vig = ctx.createRadialGradient(cx, cy, h*0.1, cx, cy, h*0.85)
      vig.addColorStop(0, 'transparent'); vig.addColorStop(1, 'rgba(2,4,8,0.7)')
      ctx.fillStyle = vig; ctx.fillRect(0, 0, w, h)

      animId = requestAnimationFrame(draw)
    }

    /* Small delay to guarantee layout is settled before first paint */
    const startTimer = setTimeout(() => { resize(); draw() }, 50)

    return () => {
      clearTimeout(startTimer)
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        display: 'block',
      }}
    />
  )
}
