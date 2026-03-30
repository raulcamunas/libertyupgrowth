'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import HeroForm from './HeroForm'

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const botDemoUrl = process.env.NEXT_PUBLIC_BOT_DEMO_URL || 'https://wa.link/su6n16'

  useEffect(() => {
    // Canvas animation (simplified version)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle animation con más partículas para efecto de puntitos
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = []
    const particleCount = window.innerWidth <= 991 ? 100 : 50 // Más partículas en móvil
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5, // Tamaño variable
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        
        // Partículas acento azul marca (#00b5ff)
        ctx.beginPath()
        ctx.fillStyle = 'rgba(0, 181, 255, 0.65)'
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <>
      <section className="hero-section" id="hero">
        <div className="hero-mist"></div>
        <canvas id="hero-canvas" ref={canvasRef}></canvas>
        <div className="hero-container">
          <div className="hero-text-col">
            <div className="logo-wrapper" id="tilt-logo">
              <Image
                src="/logo.png"
                alt="SyncBook AI"
                className="hero-main-logo"
                width={480}
                height={120}
                sizes="(max-width: 991px) 200px, 240px"
                quality={100}
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const span = document.createElement('span')
                  span.className = 'hero-main-logo-text'
                  span.innerHTML = '<span style="color: white;">SYNCBOOK</span> <span style="color: #00b5ff;">AI</span>'
                  target.insertAdjacentElement('afterend', span)
                }}
              />
            </div>
            <h1 className="hero-eyebrow">
              SISTEMA DE RESERVAS IA PARA NEGOCIOS FÍSICOS
            </h1>
            <h2 className="hero-title">
              Deja de responder WhatsApps y céntrate en tus clientes
            </h2>
            <p className="hero-subtitle">
              Automatizamos tu agenda 24/7 con IA. Tus clientes reservan, confirman y cancelan por WhatsApp sin que tú tengas que tocar el móvil ni una sola vez.
            </p>

            <div className="hero-text-actions">
              <a
                className="btn-watch-video"
                id="open-video-btn"
                href={botDemoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir el bot demo"
              >
                <i className="fa-solid fa-play-circle" aria-hidden="true"></i> Solicita acceso a la demo
              </a>
            </div>
          </div>
          <div className="hero-form-col">
            <HeroForm />
          </div>
        </div>
      </section>
    </>
  )
}

