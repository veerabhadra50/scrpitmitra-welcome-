import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="fireworks"></canvas>
  <div class="content" id="content" style="opacity:0">
    <img src="/logo.jpeg" alt="ScriptMitra Logo" class="logo" />
    <h1 class="title"><span class="white">ScriptMitra</span> <span class="blue">Technology</span></h1>
    <p class="subtitle">Coming Soon</p>
    <div class="dots"><span></span><span></span><span></span></div>
  </div>
`

const canvas = document.getElementById('fireworks') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

canvas.width = window.innerWidth
canvas.height = window.innerHeight
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

interface Particle {
  x: number; y: number; vx: number; vy: number
  alpha: number; color: string; size: number
}

const particles: Particle[] = []

function randomColor() {
  const colors = ['#1e90ff','#ffffff','#00cfff','#4169e1','#87cefa','#ffd700','#ff6347']
  return colors[Math.floor(Math.random() * colors.length)]
}

function burst(x: number, y: number) {
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 6 + 1
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color: randomColor(),
      size: Math.random() * 3 + 1
    })
  }
}

function animate() {
  ctx.fillStyle = 'rgba(5,10,30,0.18)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx; p.y += p.vy
    p.vy += 0.08
    p.alpha -= 0.018
    if (p.alpha <= 0) { particles.splice(i, 1); continue }
    ctx.globalAlpha = p.alpha
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  requestAnimationFrame(animate)
}

animate()

// Fire crackers sequence then show content
let count = 0
function fireCracker() {
  const x = Math.random() * canvas.width
  const y = Math.random() * canvas.height * 0.7
  burst(x, y)
  count++
  if (count < 12) {
    setTimeout(fireCracker, 300)
  } else {
    // Show content after crackers
    setTimeout(() => {
      const content = document.getElementById('content')!
      content.style.transition = 'opacity 1.2s ease'
      content.style.opacity = '1'
      // Keep subtle bursts
      setInterval(() => {
        burst(Math.random() * canvas.width, Math.random() * canvas.height * 0.6)
      }, 2500)
    }, 400)
  }
}

setTimeout(fireCracker, 500)
