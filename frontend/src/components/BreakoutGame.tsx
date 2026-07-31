import { useEffect, useRef, useCallback, useState } from 'react'
import { X } from 'lucide-react'

interface Props {
  onClose: () => void
}

const TRACK_COLORS = ['#8B3DFF', '#E8005E', '#22c55e', '#264BEE', '#FFFFFF']
const COLS = 10
const ROWS = 5
const BRICK_GAP = 4
const BALL_R = 7
const PADDLE_H = 14
const BASE_SPEED = 5

export default function BreakoutGame({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const stateRef = useRef({
    paddleX: 0,
    paddleW: 0,
    ballX: 0,
    ballY: 0,
    ballVX: 0,
    ballVY: 0,
    bricks: [] as { x: number; y: number; w: number; h: number; color: string; alive: boolean }[],
    score: 0,
    lives: 3,
    started: false,
    gameOver: false,
  })

  const initBricks = useCallback((w: number) => {
    const bricks: typeof stateRef.current.bricks = []
    const brickH = 20
    const totalGap = BRICK_GAP * (COLS + 1)
    const brickW = (w - totalGap) / COLS
    const topOffset = 60

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        bricks.push({
          x: BRICK_GAP + col * (brickW + BRICK_GAP),
          y: topOffset + row * (brickH + BRICK_GAP),
          w: brickW,
          h: brickH,
          color: TRACK_COLORS[row % TRACK_COLORS.length],
          alive: true,
        })
      }
    }
    return bricks
  }, [])

  const resetBall = useCallback((w: number, h: number) => {
    const s = stateRef.current
    s.ballX = w / 2
    s.ballY = h - 60
    const angle = -Math.PI / 4 + Math.random() * (-Math.PI / 2)
    s.ballVX = Math.cos(angle) * BASE_SPEED
    s.ballVY = Math.sin(angle) * BASE_SPEED
    s.started = false
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const s = stateRef.current
    s.paddleW = Math.min(120, canvas.width * 0.2)
    s.paddleX = canvas.width / 2 - s.paddleW / 2
    s.bricks = initBricks(canvas.width)
    resetBall(canvas.width, canvas.height)
    s.started = false

    const keys = new Set<string>()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      keys.add(e.key)
      if (!s.started && (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        s.started = true
      }
    }
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const onMouseMove = (e: MouseEvent) => {
      s.paddleX = Math.max(0, Math.min(canvas.width - s.paddleW, e.clientX - s.paddleW / 2))
      if (!s.started) s.started = true
    }
    canvas.addEventListener('mousemove', onMouseMove)

    let touchX: number | null = null
    const onTouchStart = (e: TouchEvent) => {
      touchX = e.touches[0].clientX
      if (!s.started) s.started = true
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (touchX !== null) {
        const dx = e.touches[0].clientX - touchX
        s.paddleX = Math.max(0, Math.min(canvas.width - s.paddleW, s.paddleX + dx))
        touchX = e.touches[0].clientX
      }
    }
    const onTouchEnd = () => { touchX = null }
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: true })

    const loop = () => {
      const w = canvas.width
      const h = canvas.height
      const paddleSpeed = 8

      if (keys.has('ArrowLeft') || keys.has('a')) s.paddleX = Math.max(0, s.paddleX - paddleSpeed)
      if (keys.has('ArrowRight') || keys.has('d')) s.paddleX = Math.min(w - s.paddleW, s.paddleX + paddleSpeed)

      if (s.started && !s.gameOver) {
        s.ballX += s.ballVX
        s.ballY += s.ballVY

        // Wall collisions
        if (s.ballX - BALL_R <= 0) { s.ballX = BALL_R; s.ballVX *= -1 }
        if (s.ballX + BALL_R >= w) { s.ballX = w - BALL_R; s.ballVX *= -1 }
        if (s.ballY - BALL_R <= 0) { s.ballY = BALL_R; s.ballVY *= -1 }

        // Paddle collision
        const paddleTop = h - 40
        if (
          s.ballVY > 0 &&
          s.ballY + BALL_R >= paddleTop &&
          s.ballY + BALL_R <= paddleTop + PADDLE_H &&
          s.ballX >= s.paddleX &&
          s.ballX <= s.paddleX + s.paddleW
        ) {
          s.ballY = paddleTop - BALL_R
          const hitPos = (s.ballX - s.paddleX) / s.paddleW - 0.5
          const angle = hitPos * (Math.PI / 3)
          const speed = Math.sqrt(s.ballVX * s.ballVX + s.ballVY * s.ballVY) * 1.01
          s.ballVX = Math.sin(angle) * speed
          s.ballVY = -Math.cos(angle) * speed
        }

        // Bottom - lose life
        if (s.ballY > h) {
          s.lives--
          if (s.lives <= 0) {
            s.gameOver = true
            setGameOver(true)
          } else {
            resetBall(w, h)
          }
        }

        // Brick collisions
        for (const brick of s.bricks) {
          if (!brick.alive) continue
          if (
            s.ballX + BALL_R > brick.x &&
            s.ballX - BALL_R < brick.x + brick.w &&
            s.ballY + BALL_R > brick.y &&
            s.ballY - BALL_R < brick.y + brick.h
          ) {
            brick.alive = false
            s.score++
            setScore(s.score)

            // Determine bounce direction
            const overlapLeft = (s.ballX + BALL_R) - brick.x
            const overlapRight = (brick.x + brick.w) - (s.ballX - BALL_R)
            const overlapTop = (s.ballY + BALL_R) - brick.y
            const overlapBottom = (brick.y + brick.h) - (s.ballY - BALL_R)
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              s.ballVX *= -1
            } else {
              s.ballVY *= -1
            }

            // Check win
            if (s.bricks.every(b => !b.alive)) {
              s.gameOver = true
              setGameOver(true)
            }
            break
          }
        }
      } else if (!s.started) {
        s.ballX = s.paddleX + s.paddleW / 2
        s.ballY = h - 60
      }

      // Draw
      ctx.fillStyle = '#0A1128'
      ctx.fillRect(0, 0, w, h)

      // Bricks
      for (const brick of s.bricks) {
        if (!brick.alive) continue
        ctx.fillStyle = brick.color
        ctx.beginPath()
        const r = 4
        ctx.moveTo(brick.x + r, brick.y)
        ctx.lineTo(brick.x + brick.w - r, brick.y)
        ctx.quadraticCurveTo(brick.x + brick.w, brick.y, brick.x + brick.w, brick.y + r)
        ctx.lineTo(brick.x + brick.w, brick.y + brick.h - r)
        ctx.quadraticCurveTo(brick.x + brick.w, brick.y + brick.h, brick.x + brick.w - r, brick.y + brick.h)
        ctx.lineTo(brick.x + r, brick.y + brick.h)
        ctx.quadraticCurveTo(brick.x, brick.y + brick.h, brick.x, brick.y + brick.h - r)
        ctx.lineTo(brick.x, brick.y + r)
        ctx.quadraticCurveTo(brick.x, brick.y, brick.x + r, brick.y)
        ctx.fill()
      }

      // Paddle
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      const pr = 7
      const py = h - 40
      ctx.moveTo(s.paddleX + pr, py)
      ctx.lineTo(s.paddleX + s.paddleW - pr, py)
      ctx.quadraticCurveTo(s.paddleX + s.paddleW, py, s.paddleX + s.paddleW, py + pr)
      ctx.lineTo(s.paddleX + s.paddleW, py + PADDLE_H - pr)
      ctx.quadraticCurveTo(s.paddleX + s.paddleW, py + PADDLE_H, s.paddleX + s.paddleW - pr, py + PADDLE_H)
      ctx.lineTo(s.paddleX + pr, py + PADDLE_H)
      ctx.quadraticCurveTo(s.paddleX, py + PADDLE_H, s.paddleX, py + PADDLE_H - pr)
      ctx.lineTo(s.paddleX, py + pr)
      ctx.quadraticCurveTo(s.paddleX, py, s.paddleX + pr, py)
      ctx.fill()

      // Ball
      ctx.fillStyle = '#E8005E'
      ctx.beginPath()
      ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2)
      ctx.fill()

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [onClose, resetBall, initBricks])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[99999]">
      <canvas ref={canvasRef} className="block w-full h-full" style={{ touchAction: 'none' }} />

      {/* Score and Lives */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-8 pointer-events-none select-none">
        <span className="text-white/60 text-lg sm:text-xl font-mono font-bold">Score: {score}</span>
        <span className="text-white/60 text-lg sm:text-xl font-mono font-bold">Lives: {stateRef.current.lives}</span>
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-navy-light rounded-2xl p-8 text-center max-w-sm mx-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              {stateRef.current.bricks.every(b => !b.alive) ? 'You Win!' : 'Game Over'}
            </h2>
            <p className="text-gray-300 mb-4">Score: {score}</p>
            <button
              onClick={onClose}
              className="bg-magenta hover:bg-magenta-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Back to Conference
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        style={{ width: 44, height: 44 }}
        aria-label="Close game"
      >
        <X className="w-6 h-6" />
      </button>

      {!stateRef.current.started && !gameOver && (
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none select-none">
          <span className="text-white/30 text-xs sm:text-sm">Move mouse, use arrow keys, or swipe to play</span>
        </div>
      )}
    </div>
  )
}
