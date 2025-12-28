'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import HeroForm from './HeroForm'

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoModalRef = useRef<HTMLDivElement>(null)
  const videoIframeRef = useRef<HTMLIFrameElement>(null)
  const videoLoadedRef = useRef(false)

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
        
        // Dibujar partícula con color naranja
        ctx.beginPath()
        ctx.fillStyle = 'rgba(255, 102, 0, 0.6)' // Color naranja más visible
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

  // Prefetch del video - funciona en desktop (hover) y móvil (touchstart + visible)
  const prefetchVideo = () => {
    if (!videoLoadedRef.current && videoIframeRef.current) {
      const iframe = videoIframeRef.current
      if (iframe.dataset.src && !iframe.src) {
        // Prefetch: crear un iframe oculto para precargar el video
        const hiddenIframe = document.createElement('iframe')
        hiddenIframe.style.display = 'none'
        hiddenIframe.style.width = '1px'
        hiddenIframe.style.height = '1px'
        hiddenIframe.style.position = 'absolute'
        hiddenIframe.style.opacity = '0'
        hiddenIframe.style.pointerEvents = 'none'
        hiddenIframe.src = iframe.dataset.src
        hiddenIframe.id = 'video-prefetch-iframe'
        document.body.appendChild(hiddenIframe)
        
        // Cuando el iframe oculto se carga, ya tenemos el video listo
        hiddenIframe.onload = () => {
          // El video ya está precargado, solo necesitamos mover el src al iframe visible
          if (iframe && iframe.dataset.src) {
            iframe.src = iframe.dataset.src + '&autoplay=1&rel=0'
            videoLoadedRef.current = true
            // Remover el iframe oculto después de un momento
            setTimeout(() => {
              const prefetchIframe = document.getElementById('video-prefetch-iframe')
              if (prefetchIframe) {
                prefetchIframe.remove()
              }
            }, 1000)
          }
        }
      }
    }
  }

  // Precargar video cuando el botón está visible (móvil y desktop)
  useEffect(() => {
    const videoButton = document.getElementById('open-video-btn')
    if (!videoButton) return

    // Intersection Observer: precargar cuando el botón es visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !videoLoadedRef.current) {
            // Precargar después de un pequeño delay para no bloquear el render inicial
            setTimeout(() => {
              prefetchVideo()
            }, 500)
            observer.disconnect() // Solo precargar una vez
          }
        })
      },
      { threshold: 0.5 } // Cuando el 50% del botón es visible
    )

    observer.observe(videoButton)

    return () => {
      observer.disconnect()
    }
  }, [])

  const openVideo = () => {
    if (videoModalRef.current) {
      videoModalRef.current.classList.add('active')
      const iframe = videoIframeRef.current
      
      // Si el video ya fue precargado (por hover), solo activar autoplay
      if (iframe && videoLoadedRef.current && iframe.src) {
        const currentSrc = iframe.src.split('&autoplay')[0].split('?')[0]
        iframe.src = currentSrc + '?autoplay=1&rel=0&modestbranding=1'
      } else if (iframe && !videoLoadedRef.current && iframe.dataset.src) {
        // Cargar inmediatamente con autoplay si no se precargó
        iframe.src = iframe.dataset.src + '&autoplay=1&rel=0&modestbranding=1'
        videoLoadedRef.current = true
      }
      
      // Remover iframe de prefetch si existe
      const prefetchIframe = document.getElementById('video-prefetch-iframe')
      if (prefetchIframe) {
        prefetchIframe.remove()
      }
    }
  }

  const closeVideo = () => {
    if (videoModalRef.current) {
      videoModalRef.current.classList.remove('active')
    }
  }

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
                alt="LibertySeller - Agencia Amazon FBA"
                className="hero-main-logo"
                width={120}
                height={30}
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const span = document.createElement('span')
                  span.className = 'hero-main-logo-text'
                  span.innerHTML = '<span style="color: white;">LIBERTY</span> <span style="color: #FF6600;">SELLER</span>'
                  target.insertAdjacentElement('afterend', span)
                }}
              />
            </div>
            <h1 className="hero-title">
              Escala tu facturación en Amazon y olvídate de la operativa
            </h1>
            <p className="hero-subtitle">
              Gestionamos y optimizamos tu cuenta de vendedor para disparar tu rentabilidad. Ya sea que estés lanzando o facturando 6 cifras, llevamos tu marca al siguiente nivel.
            </p>
            
            <div className="hero-stats-wrapper">
              <div className="stats-track">
                <div className="stat-badge">
                  <i className="fa-solid fa-chart-line"></i> <span>7.8M+ Facturados</span>
                </div>
                <div className="stat-badge">
                  <i className="fa-solid fa-users"></i> <span>+20 Marcas Activas</span>
                </div>
                <div className="stat-badge">
                  <i className="fa-solid fa-check-circle"></i> <span>Amazon GrowthPartner</span>
                </div>
                <div className="stat-badge">
                  <i className="fa-solid fa-arrow-trend-up"></i> <span>ROAS Medio 4.5x</span>
                </div>
                <div className="stat-badge">
                  <i className="fa-solid fa-globe"></i> <span>+7 Mercados</span>
                </div>
                <div className="stat-badge">
                  <i className="fa-solid fa-chart-line"></i> <span>7.8M+ Facturados</span>
                </div>
                <div className="stat-badge">
                  <i className="fa-solid fa-users"></i> <span>+20 Marcas Activas</span>
                </div>
                <div className="stat-badge">
                  <i className="fa-solid fa-check-circle"></i> <span>Amazon Growth Partner</span>
                </div>
                <div className="stat-badge">
                  <i className="fa-solid fa-arrow-trend-up"></i> <span>Aumento Buy Box</span>
                </div>
                <div className="stat-badge">
                  <i className="fa-solid fa-globe"></i> <span>5 Mercados</span>
                </div>
              </div>
            </div>

            <div className="hero-text-actions">
              <button
                className="btn-watch-video"
                id="open-video-btn"
                onClick={openVideo}
                onMouseEnter={prefetchVideo}
                onFocus={prefetchVideo}
                onTouchStart={prefetchVideo}
                aria-label="Ver video explicativo de LibertySeller"
              >
                <i className="fa-solid fa-play-circle" aria-hidden="true"></i> Mira como podemos ayudarte
              </button>
            </div>
          </div>
          <div className="hero-form-col">
            <HeroForm />
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <div className="video-modal" id="video-modal" ref={videoModalRef}>
        <div className="video-modal-content">
          <button
            className="close-modal-btn"
            id="close-video-btn"
            onClick={closeVideo}
            aria-label="Cerrar video"
          >
            <i className="fa-solid fa-times"></i>
          </button>
          <iframe
            className="video-iframe"
            src=""
            data-src="https://www.youtube.com/embed/ZNNf6FIJtiQ?si=JfTEZakmnziKT-JE&rel=0&modestbranding=1"
            title="VSL Video - Cómo funciona LibertySeller"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="eager"
            ref={videoIframeRef}
          ></iframe>
        </div>
      </div>
    </>
  )
}

