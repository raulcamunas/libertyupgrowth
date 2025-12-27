'use client'

import { useEffect } from 'react'
import Image from 'next/image'

const featureData = {
  orange: {
    tagline: 'Si ya eres vendedor',
    title: 'Tu cuenta de Amazon tiene más potencial, vamos a desbloquearlo',
    desc: 'Tienes buen producto, pero el algoritmo es despiadado. Dejamos de lado las intuiciones y aplicamos ingeniería de datos para arreglar lo que falla, reducir tu ACOS y recuperar el control de tu facturación',
    cards: [
      { icon: 'fa-chart-line', title: 'Reducción de ACOS', desc: 'Dejamos de quemar dinero en PPC\'s. Optimizamos tus campañas para maximizar el ROAS y eliminar palabras clave que solo generan gasto' },
      { icon: 'fa-magnifying-glass', title: 'SEO y Posicionamiento Orgánico', desc: 'No solo buscamos keywords, entendemos la intención de compra. Posicionamos tus productos correctamente.' },
      { icon: 'fa-store', title: 'Contenido A+ y Storefront', desc: 'Tu marca debe parecer premium para cobrar como premium. Diseñamos fichas y tiendas que disparan la tasa de conversión.' },
      { icon: 'fa-warehouse', title: 'Logística FBA Sin Fisuras', desc: 'Evitamos roturas de stock y sobrecostes de almacenamiento. Planificamos tus envíos para que Amazon siempre tenga inventario sano.' },
      { icon: 'fa-shield', title: 'Protección de Marca', desc: '¿Hijackers? ¿Falsificaciones? Nos encargamos de limpiar tu listado y proteger tu propiedad intelectual con Brand Registry.' },
      { icon: 'fa-globe', title: 'Expansión Internacional', desc: '¿Vendes solo en tu pais? Analizamos tu tienda para armar un plan de internacionalización para vender en más paises.' },
      { icon: 'fa-headset', title: 'Salud de cuenta y Bloqueos', desc: ' Recuperamos cuentas suspendidas y gestionamos casos complejos con el soporte de Amazon (sí, hablamos su idioma)' },
      { icon: 'fa-chart-bar', title: 'Auditoría de Rentabilidad', desc: 'Te decimos cuánto ganas realmente. Desglosamos márgenes reales después de comisiones, devoluciones y publicidad.' }
    ]
  },
  blue: {
    tagline: 'Aun no vendes en Amazon',
    title: 'Empieza a vender en Amazon con una "ventaja injusta"',
    desc: 'La mayoría de nuevos vendedores fracasan por falta de estrategia. Nosotros construimos los cimientos sólidos de tu marca para que te saltes la curva de aprendizaje (y los errores caros) desde el día uno.',
    cards: [
      { icon: 'fa-chart-bar', title: 'Validación de Mercado', desc: 'Antes de gastar un euro en stock, analizamos la demanda y la competencia para asegurarnos de que tu producto tiene hueco' },
      { icon: 'fa-file-invoice', title: 'Burocracia Cero', desc: ' Nos ocupamos del alta de cuenta, registros fiscales y normativas de Amazon. Tú olvídate del papeleo aburrido.' },
      { icon: 'fa-rocket', title: 'Estrategia de Lanzamiento ', desc: 'Aprovechamos la "Luna de Miel" del algoritmo. Diseñamos una estrategia agresiva para conseguir tracción y reseñas desde el día 1.' },
      { icon: 'fa-pen-fancy', title: 'Copywriting Persuasivo', desc: ' Escribimos títulos y viñetas que venden. Transformamos características técnicas en deseos de compra irresistibles.' },
      { icon: 'fa-camera', title: 'Fotografía Estratégica', desc: 'En Amazon no se toca el producto, se compra por los ojos. Creamos imágenes y renders que destacan frente a la competencia.' },
      { icon: 'fa-ship', title: 'Gestión de Importación', desc: 'Te asesoramos en la primera entrada de stock a los almacenes de Amazon (FBA) para que no rechacen tu mercancía.' },
      { icon: 'fa-bullhorn', title: 'Publicidad de Controlada', desc: ' Configuramos tus primeras campañas de PPC para ganar visibilidad inmediata sin desperdiciar presupuesto en pruebas a ciegas.' },
      { icon: 'fa-user-tie', title: 'Mentoria 1 a 1', desc: 'No estarás solo ante el gigante. Tendrás un canal directo con expertos para resolver dudas y definir el futuro de tu marca.' }
    ]
  }
}

export default function FeaturesSection() {
  useEffect(() => {
    let currentTheme = 'orange'
    let isAnimating = false

    const featuresSection = document.getElementById('features-section')
    const featuresGrid = document.getElementById('features-grid')
    const headerTextContainer = document.getElementById('header-text-container')

    function renderCardsHTML(theme: 'orange' | 'blue') {
      const data = featureData[theme]
      const taglineEl = document.getElementById('feature-tagline')
      const titleEl = document.getElementById('feature-title')
      const descEl = document.getElementById('feature-desc')

      if (taglineEl) taglineEl.textContent = data.tagline
      if (titleEl) titleEl.textContent = data.title
      if (descEl) descEl.textContent = data.desc

      if (featuresGrid) {
        featuresGrid.innerHTML = ''
        data.cards.forEach((card, index) => {
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

    function setTheme(theme: 'orange' | 'blue') {
      if (currentTheme === theme || isAnimating || !featuresSection || !headerTextContainer || !featuresGrid) return
      
      isAnimating = true
      headerTextContainer.classList.add('switching')
      featuresGrid.classList.add('switching')

      setTimeout(() => {
        currentTheme = theme
        if (theme === 'orange') {
          featuresSection.classList.add('theme-orange')
          featuresSection.classList.remove('theme-blue')
        } else {
          featuresSection.classList.add('theme-blue')
          featuresSection.classList.remove('theme-orange')
        }
        renderCardsHTML(theme)
        requestAnimationFrame(() => {
          featuresSection.classList.add('switching')
        })
        headerTextContainer.classList.remove('switching')
        featuresGrid.classList.remove('switching')
        isAnimating = false
      }, 300)
    }

    function toggleTheme() {
      if (currentTheme === 'orange') setTheme('blue')
      else setTheme('orange')
    }

    // Hacer funciones globales
    ;(window as any).setTheme = setTheme
    ;(window as any).toggleTheme = toggleTheme

    // Renderizar inicial
    renderCardsHTML('orange')

    // Event listeners
    const switchTrack = document.querySelector('.switch-track')
    if (switchTrack) {
      switchTrack.addEventListener('click', toggleTheme)
    }

    const brandLabel = document.querySelector('.switch-label.brand')
    const sellerLabel = document.querySelector('.switch-label.seller')
    if (brandLabel) brandLabel.addEventListener('click', () => setTheme('orange'))
    if (sellerLabel) sellerLabel.addEventListener('click', () => setTheme('blue'))
  }, [])

  return (
    <section className="features-section theme-orange" id="features-section">
      <div className="features-container">
        <div className="features-header">
          <div className="header-text dynamic-content" id="header-text-container">
            <div className="features-label scroll-trigger" id="feature-tagline">
              Si ya eres vendedor
            </div>
            <h2 className="features-title scroll-trigger" id="feature-title">
              Tu cuenta de Amazon tiene más potencial, vamos a desbloquearlo
            </h2>
            <p className="features-desc scroll-trigger" id="feature-desc">
              Tienes buen producto, pero el algoritmo es despiadado. Dejamos de lado las intuiciones y aplicamos ingeniería de datos para arreglar lo que falla, reducir tu ACOS y recuperar el control de tu facturación.
            </p>
            <button
              className="btn-demo-small scroll-trigger"
              onClick={(e) => {
                e.preventDefault()
                ;(window as any).scrollToForm?.()
              }}
            >
              TE CONTACTAMOS
            </button>
          </div>

          <div className="switch-container scroll-trigger">
            <div className="switch-labels">
              <span className="switch-label brand" onClick={() => (window as any).setTheme?.('orange')}>
                Soy vendedor
              </span>
              <span className="switch-label seller" onClick={() => (window as any).setTheme?.('blue')}>
                Quiero vender
              </span>
            </div>
            <div className="switch-track" onClick={() => (window as any).toggleTheme?.()}>
              <div className="switch-knob"></div>
            </div>
          </div>
        </div>
        <div className="features-grid dynamic-content scroll-trigger" id="features-grid"></div>
      </div>
    </section>
  )
}

