'use client'

import { useEffect } from 'react'
import Image from 'next/image'

const featureData = {
  tagline: 'PARA NEGOCIOS CON AMBICIÓN',
  title: 'Tu negocio tiene más potencial, vamos a automatizarlo',
  desc: 'Tienes un servicio excelente, pero gestionar las citas a mano te frena. Aplicamos ingeniería de procesos con IA para eliminar las tareas repetitivas, reducir huecos libres y recuperar el control de tu tiempo.',
  cards: [
    {
      icon: 'fa-infinity',
      title: 'Reservas 24/7',
      desc: 'Tu agenda sigue abierta mientras duermes. El bot atiende, filtra y confirma citas por WhatsApp sin esperas.',
    },
    {
      icon: 'fa-phone-slash',
      title: 'Cero Llamadas',
      desc: 'Deja de interrumpir tus servicios para coger el teléfono. Tu IA se encarga de las dudas frecuentes y el agendamiento.',
    },
    {
      icon: 'fa-bell',
      title: 'Recordatorios IA',
      desc: 'Reducción drástica de "no-presentados". El sistema envía avisos de confirmación automáticos antes de cada cita.',
    },
    {
      icon: 'fa-chart-column',
      title: 'Dashboard Real-Time',
      desc: 'Toma el control con un panel visual (Supabase). Mira tus métricas, ingresos proyectados y huecos libres de un vistazo.',
    },
    {
      icon: 'fa-comments',
      title: 'Integración Nativa',
      desc: 'Utilizamos tu número de siempre vía Evolution API. Sin apps raras para el cliente, todo ocurre en su WhatsApp.',
    },
    {
      icon: 'fa-users',
      title: 'Escalado de Equipo',
      desc: '¿Tienes varios empleados? El sistema reparte las citas equitativamente o permite elegir profesional específico.',
    },
    {
      icon: 'fa-id-card',
      title: 'Historial Inteligente',
      desc: 'El bot reconoce a clientes recurrentes, recuerda sus preferencias y agiliza su próxima reserva en segundos.',
    },
    {
      icon: 'fa-magnifying-glass',
      title: 'Auditoría de Procesos',
      desc: 'Analizamos tu flujo actual y creamos un n8n personalizado que soluciona los cuellos de botella de tu negocio.',
    },
  ],
}

export default function FeaturesSection() {
  useEffect(() => {
    const featuresGrid = document.getElementById('features-grid')
    let observer: IntersectionObserver | null = null
    let intervalId: number | null = null

    function renderCardsHTML() {
      const taglineEl = document.getElementById('feature-tagline')
      const titleEl = document.getElementById('feature-title')
      const descEl = document.getElementById('feature-desc')

      if (taglineEl) taglineEl.textContent = featureData.tagline
      if (titleEl) titleEl.textContent = featureData.title
      if (descEl) descEl.textContent = featureData.desc

      if (featuresGrid) {
        featuresGrid.innerHTML = ''
        featureData.cards.forEach((card, index) => {
          const cardHTML = `
            <div class="feature-card" style="transition-delay: ${index * 0.1}s;">
              <i class="fa-solid ${card.icon} feature-icon"></i>
              <h3 class="feature-card-title">${card.title}</h3>
              <p class="feature-card-desc">${card.desc}</p>
            </div>
          `
          featuresGrid.insertAdjacentHTML('beforeend', cardHTML)
        })
      }
    }

    // Renderizar inicial
    renderCardsHTML()

    const kpiCard = document.querySelector('.features-kpi-card') as HTMLElement | null
    const kpiNumber = document.getElementById('features-kpi-number')

    if (kpiCard && kpiNumber) {
      let hasAnimated = false
      const targetValue = 15

      const animate = () => {
        if (hasAnimated) return
        hasAnimated = true

        let current = 0
        const intervalMs = 60
        intervalId = window.setInterval(() => {
          current += 1
          kpiNumber.textContent = `${current}h+`
          if (current >= targetValue) {
            if (intervalId) window.clearInterval(intervalId)
            intervalId = null
          }
        }, intervalMs)
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate()
              observer?.disconnect()
              observer = null
            }
          })
        },
        { threshold: 0.35 }
      )

      observer.observe(kpiCard)
    }

    return () => {
      if (observer) observer.disconnect()
      observer = null
      if (intervalId) window.clearInterval(intervalId)
      intervalId = null
    }
  }, [])

  return (
    <section className="features-section theme-orange" id="servicios">
      <div className="features-container">
        <div className="features-header">
          <div className="header-text dynamic-content" id="header-text-container">
            <div className="features-label scroll-trigger" id="feature-tagline">
              PARA NEGOCIOS CON AMBICIÓN
            </div>
            <h2 className="features-title scroll-trigger" id="feature-title">
              Tu negocio tiene más potencial, vamos a automatizarlo
            </h2>
            <p className="features-desc scroll-trigger" id="feature-desc">
              Tienes un servicio excelente, pero gestionar las citas a mano te frena. Aplicamos ingeniería de procesos con IA para eliminar las tareas repetitivas, reducir huecos libres y recuperar el control de tu tiempo.
            </p>
            <button
              className="btn-demo-small scroll-trigger"
              onClick={(e) => {
                e.preventDefault()
                ;(window as any).scrollToForm?.()
              }}
            >
              ME INTERESA
            </button>
          </div>

          <div className="features-kpi-card scroll-trigger" aria-hidden="true">
            <div className="features-kpi-top">
              <div className="features-kpi-number" id="features-kpi-number">15h+</div>
              <div className="features-kpi-text">Tiempo recuperado a la semana.</div>
            </div>
            <div className="features-kpi-subtext">
              Nuestros sistemas automatizan el equivalente a media jornada laboral de un recepcionista humano.
            </div>
          </div>
        </div>
        <div className="features-grid dynamic-content" id="features-grid"></div>
      </div>
    </section>
  )
}

