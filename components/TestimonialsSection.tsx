'use client'

import { useEffect } from 'react'
import Image from 'next/image'

const testimonialsData = [
  { id: 1, name: 'Everox', image: '/partner_1.png', stat: 'Lanzamiento exitoso', desc: 'Marca creada desde 0 que llegó a tener 3000€/dia de facturación.', tag: 'Marca Privada' },
  { id: 2, name: 'Diru', image: '/partner_2.png', stat: 'Cuenta en crecimiento', desc: 'Nuestro cliente decidió confiar en un equipo que le creé la cuenta desde 0 y ya gestiona varios productos rentables con +20% de rentabilidad cada uno.', tag: 'Cuenta nueva' },
  { id: 3, name: 'IronTechGlobal', image: '/partner_3.png', stat: 'Optimización de PPC\'s', desc: 'Estudio y gestión activa de campañas de PPC\'s, el cliente venia gastando 60% de ACOS por culpa de otras agencias y con nosotros bajó a 13% (y bajando...)', tag: 'PPC\'s' },
  { id: 4, name: 'EvoComputer', image: '/partner_4.png', stat: 'Volcado de Inventario', desc: 'Un cliente que tenía un gran potencial en su catálogo y no lo tenía online. Analizamos rentabilidades y aumentamos facturación en pocas semanas.', tag: 'Inventario sin explotar' },
  { id: 5, name: 'Creative Toys', image: '/partner_5.png', stat: 'Marca Reconocida', desc: 'Empresa TOP en el mercado de juegos de mesa que decidió contar con nosotros para crear su canal de ventas online desde cero.', tag: 'Creación de cuenta' },
  { id: 6, name: 'BSC', image: '/partner_6.png', stat: 'Gestión 360º', desc: 'Cliente que cuenta con nuestra ayuda para gestionar su crecimiento de manera activa. Optimización continua y mejora del rendimiento.', tag: 'Gestión y performance' },
  { id: 7, name: 'Naranjas Ramblizo', image: '/partner_7.png', stat: 'Marca con productos de comida', desc: 'Trabajamos con este cliente para llevar su negocio de fruta a la venta online, consiguiendo ventas asombrosas cada dia.', tag: 'Marca Privada' },
  { id: 8, name: 'SAUSI', image: '/partner_8.png', stat: 'Una de nuestras Mejores Tiendas', desc: 'Lanzamiento de tienda desde 0, contando con varios productos de más de 20% de margen y con altas ventas al dia (+10ud)', tag: 'Nuevo Vendedor' }
]

export default function TestimonialsSection() {
  useEffect(() => {
    const testimonialsGrid = document.getElementById('testimonials-grid')
    const popup = document.getElementById('testimonial-popup')

    if (testimonialsGrid) {
      testimonialsGrid.innerHTML = ''
      testimonialsData.forEach((client) => {
        const card = document.createElement('div')
        card.className = 'client-card'
        card.onclick = () => showPopup(client)
        card.innerHTML = `<img src="${client.image}" alt="${client.name} - Partner Liberty UpGrowth" class="client-logo-img" loading="lazy" style="width: auto; height: auto;">`
        testimonialsGrid.appendChild(card)
      })
    }

    function showPopup(client: typeof testimonialsData[0]) {
      const popupImg = document.getElementById('popup-logo-img')
      const popupStat = document.getElementById('popup-stat')
      const popupDesc = document.getElementById('popup-desc')
      const popupTag = document.getElementById('popup-tag')

      if (popupImg) popupImg.setAttribute('src', client.image)
      if (popupStat) popupStat.textContent = client.stat
      if (popupDesc) popupDesc.textContent = client.desc
      if (popupTag) popupTag.textContent = client.tag
      if (popup) popup.classList.add('active')
    }

    ;(window as any).closePopup = function() {
      if (popup) popup.classList.remove('active')
    }

    document.addEventListener('click', (e) => {
      if (popup && popup.classList.contains('active')) {
        const target = e.target as HTMLElement
        if (!popup.contains(target) && !target.closest('.client-card')) {
          ;(window as any).closePopup()
        }
      }
    })
  }, [])

  return (
    <section id="testimonios" className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title scroll-trigger">
          Algunos de nuestros partners que confían en nosotros
        </h2>
        <p className="testimonials-subtitle scroll-trigger">
          Haz clic en ellas para ver cómo pudimos ayudarles
        </p>

        <div className="testimonials-grid scroll-trigger" id="testimonials-grid"></div>

        <div className="testimonial-popup" id="testimonial-popup">
          <button 
            className="popup-close" 
            onClick={() => (window as any).closePopup?.()}
            aria-label="Cerrar ventana de testimonio"
          >
            <i className="fa-solid fa-times" aria-hidden="true"></i>
          </button>
          <div className="popup-image-container" id="popup-image-container">
            <img
              id="popup-logo-img"
              src=""
              alt="Partner Logo"
              className="popup-logo-img"
              loading="lazy"
              width={200}
              height={90}
            />
          </div>
          <div id="popup-stat" className="popup-stat">
            +140%
          </div>
          <p id="popup-desc" className="popup-desc">
            Descripción del resultado logrado...
          </p>
          <span id="popup-tag" className="popup-tag">
            ESTRATEGIA PPC
          </span>
        </div>
      </div>
      <div className="section-cta">
        <button
          className="section-cta-btn"
          onClick={(e) => {
            e.preventDefault()
            ;(window as any).scrollToForm?.()
          }}
        >
          <span>¿Listo para empezar?</span>
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </section>
  )
}

