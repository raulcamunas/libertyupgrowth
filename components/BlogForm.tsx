'use client'

import { useEffect, useState } from 'react'

export default function BlogForm() {
  const [isAmazonSeller, setIsAmazonSeller] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eventSent, setEventSent] = useState(false)

  useEffect(() => {
    // Toggle expandable fields
    const amazonToggle = document.getElementById('blog-form-amazon-seller') as HTMLInputElement
    const expandable = document.getElementById('blog-expandable')
    
    const handleToggle = () => {
      const checked = amazonToggle?.checked || false
      setIsAmazonSeller(checked)
      if (expandable) {
        if (checked) {
          expandable.classList.add('open')
        } else {
          expandable.classList.remove('open')
        }
      }
    }

    amazonToggle?.addEventListener('change', handleToggle)

    // Pill button selection
    const selectPill = (element: HTMLElement, inputId: string, gridId: string) => {
      const grid = document.getElementById(gridId)
      const input = document.getElementById(inputId) as HTMLInputElement
      
      if (grid && input) {
        // Remove active from all pills in this grid
        grid.querySelectorAll('.pill-btn').forEach((btn) => {
          btn.classList.remove('active')
        })
        // Add active to clicked pill
        element.classList.add('active')
        // Set hidden input value
        input.value = element.getAttribute('data-value') || element.textContent || ''
      }
    }

    // Attach click handlers to pill buttons within this form
    const form = document.getElementById('blog-signup-form')
    if (form) {
      const pillButtons = form.querySelectorAll('.pill-btn')
      pillButtons.forEach((btn) => {
        btn.addEventListener('click', function(this: HTMLElement) {
          const gridId = this.closest('.pill-grid')?.id
          const inputId = gridId === 'blog-duration-grid' ? 'blog-duration-input' : 'blog-revenue-input'
          selectPill(this, inputId, gridId || '')
        })
      })
    }

    // Country selector
    const countrySelector = document.getElementById('blog-country-selector')
    const countryFlag = document.getElementById('blog-country-flag')
    const prefixSelect = document.getElementById('blog-form-prefix') as HTMLSelectElement

    prefixSelect?.addEventListener('change', function(this: HTMLSelectElement) {
      const selectedOption = this.options[this.selectedIndex]
      const flag = selectedOption.getAttribute('data-flag')
      if (countryFlag && flag) {
        countryFlag.textContent = flag
      }
    })

    return () => {
      amazonToggle?.removeEventListener('change', handleToggle)
    }
  }, [])


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const form = e.currentTarget
    const formBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
    const originalBtnText = formBtn.innerHTML

    try {
      const formData = {
        name: (document.getElementById('blog-form-name') as HTMLInputElement).value.trim(),
        phone: (document.getElementById('blog-form-phone') as HTMLInputElement).value.trim(),
        email: (document.getElementById('blog-form-email') as HTMLInputElement).value.trim(),
        prefix: (document.getElementById('blog-form-prefix') as HTMLSelectElement).value,
        isSeller: isAmazonSeller,
        sellingDuration: (document.getElementById('blog-duration-input') as HTMLInputElement)?.value || '',
        monthlyRevenue: (document.getElementById('blog-revenue-input') as HTMLInputElement)?.value || '',
        website: (document.getElementById('blog-website-field') as HTMLInputElement)?.value || '', // Honeypot
      }

      // Validación básica del lado del cliente
      if (!formData.name || formData.name.length < 2) {
        throw new Error('Por favor, ingresa un nombre válido')
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Por favor, ingresa un email válido')
      }
      if (!formData.phone || formData.phone.length < 8) {
        throw new Error('Por favor, ingresa un teléfono válido')
      }
      if (isAmazonSeller && (!formData.sellingDuration || !formData.monthlyRevenue)) {
        throw new Error('Por favor, completa todos los campos requeridos')
      }

      formBtn.disabled = true
      formBtn.style.opacity = '0.7'
      formBtn.textContent = 'Enviando...'

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el formulario')
      }

      // Éxito
      formBtn.style.opacity = '1'
      formBtn.style.backgroundColor = '#CC5200'
      formBtn.innerHTML = '¡RECIBIDO! <i class="fa-solid fa-check"></i>'
      form.reset()
      
      // Disparar evento de conversión para Google Tag Manager (solo una vez)
      // Usar sessionStorage para prevenir duplicación incluso si el componente se monta dos veces
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        const eventKey = `form_submit_blog-signup-form_${Date.now()}`
        const lastEventKey = sessionStorage.getItem('last_form_submit_event')
        const lastEventTime = sessionStorage.getItem('last_form_submit_time')
        const now = Date.now()
        
        // Solo enviar si no se envió un evento similar en los últimos 3 segundos
        if (!lastEventKey || !lastEventTime || (now - parseInt(lastEventTime)) > 3000) {
          (window as any).dataLayer.push({
            'event': 'form_submit',
            'form_id': 'blog-signup-form',
            'form_name': 'blog_form',
            'conversion_type': 'form_submission'
          })
          sessionStorage.setItem('last_form_submit_event', eventKey)
          sessionStorage.setItem('last_form_submit_time', now.toString())
          setEventSent(true)
        }
      }
      
      form.querySelectorAll('.pill-btn').forEach(p => p.classList.remove('active'))
      const expandableFields = form.querySelector('.expandable-fields')
      if (expandableFields) expandableFields.classList.remove('open')
      setIsAmazonSeller(false)
      
      // Limpiar errores
      const errorMessages = form.querySelectorAll('.error-message')
      errorMessages.forEach(el => {
        el.textContent = ''
        el.classList.remove('show')
      })
      const errorInputs = form.querySelectorAll('.form-input.error')
      errorInputs.forEach(el => el.classList.remove('error'))
      
      setTimeout(() => {
        formBtn.disabled = false
        formBtn.style.backgroundColor = 'var(--brand-color)'
        formBtn.innerHTML = originalBtnText
        setEventSent(false) // Reset para permitir otro envío
      }, 5000)
    } catch (error: any) {
      formBtn.style.backgroundColor = '#ff4444'
      formBtn.textContent = error.message || 'Error. Intenta de nuevo.'
      setTimeout(() => {
        formBtn.disabled = false
        formBtn.style.opacity = '1'
        formBtn.style.backgroundColor = 'var(--brand-color)'
        formBtn.innerHTML = originalBtnText
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-card blog-form-card">
        <h2 className="form-title">Solicita tu Auditoría o Plan de Lanzamiento</h2>
        <form 
          id="blog-signup-form" 
          className="smart-form" 
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="selling_duration" id="blog-duration-input" />
          <input type="hidden" name="monthly_revenue" id="blog-revenue-input" />
          
          {/* Honeypot field - invisible para bots */}
          <input
            type="text"
            id="blog-website-field"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            aria-label=""
            style={{
              position: 'absolute',
              left: '-9999px',
              opacity: 0,
              pointerEvents: 'none',
              width: 0,
              height: 0,
            }}
          />
          
          <div className="input-group">
            <input
              type="text"
              id="blog-form-name"
              className="form-input"
              placeholder="Nombre completo"
              required
            />
            <div className="error-message" id="blog-name-error"></div>
          </div>
          <div className="input-group phone-group">
            <label htmlFor="blog-form-prefix" className="sr-only">
              Prefijo telefónico
            </label>
            <div className="phone-prefix-wrapper">
              <div className="country-selector" id="blog-country-selector">
                <div className="country-flag" id="blog-country-flag" aria-hidden="true">🇪🇸</div>
                <select 
                  id="blog-form-prefix" 
                  className="form-prefix-select" 
                  required
                  aria-label="Seleccionar prefijo telefónico del país"
                >
                  <option value="+34" data-flag="🇪🇸" defaultChecked>+34</option>
                  <option value="+52" data-flag="🇲🇽">+52</option>
                </select>
                <i className="fa-solid fa-chevron-down prefix-arrow" aria-hidden="true"></i>
              </div>
            </div>
            <input
              type="tel"
              id="blog-form-phone"
              className="form-input form-phone-number"
              placeholder="612 345 678"
              required
            />
            <div className="error-message" id="blog-phone-error"></div>
          </div>
          <div className="input-group">
            <input
              type="email"
              id="blog-form-email"
              className="form-input"
              placeholder="Correo electrónico"
              required
            />
            <div className="error-message" id="blog-email-error"></div>
          </div>
          
          <div className="amazon-switch-group">
            <span className="switch-label-text">¿Vendes en Amazon?</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="blog-form-amazon-seller"
                checked={isAmazonSeller}
                onChange={(e) => setIsAmazonSeller(e.target.checked)}
              />
              <span className="slider">
                <span className="txt-no">NO</span>
                <span className="txt-si">SÍ</span>
              </span>
            </label>
          </div>
          
          <div className={`expandable-fields ${isAmazonSeller ? 'open' : ''}`} id="blog-expandable">
            <span className="pill-label" id="blog-duration-label">¿Cuánto tiempo llevas vendiendo?</span>
            <div className="pill-grid cols-3" id="blog-duration-grid">
              <div className="pill-btn" data-value="0-1 año">0-1 año</div>
              <div className="pill-btn" data-value="2-5 años">2-5 años</div>
              <div className="pill-btn" data-value="+5 años">+5 años</div>
            </div>
            <div className="error-message" id="blog-duration-error"></div>
            
            <span className="pill-label" id="blog-revenue-label">¿Facturación mensual?</span>
            <div className="pill-grid cols-4" id="blog-revenue-grid">
              <div className="pill-btn" data-value="0-5k">0-5k</div>
              <div className="pill-btn" data-value="5k-20k">5k-20k</div>
              <div className="pill-btn" data-value="20k-50k">20k-50k</div>
              <div className="pill-btn" data-value="+50k">+50k</div>
            </div>
            <div className="error-message" id="blog-revenue-error"></div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'QUIERO EMPEZAR'}
          </button>
        </form>
      </div>
  )
}

