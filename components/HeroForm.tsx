'use client'

import { useEffect, useState } from 'react'

export default function HeroForm() {
  const [isAmazonSeller, setIsAmazonSeller] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eventSent, setEventSent] = useState(false)

  useEffect(() => {
    // Toggle expandable fields
    const amazonToggle = document.getElementById('form-amazon-seller') as HTMLInputElement
    const expandable = document.getElementById('hero-expandable')
    
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

    // Attach click handlers to pill buttons
    const pillButtons = document.querySelectorAll('.pill-btn')
    pillButtons.forEach((btn) => {
      btn.addEventListener('click', function(this: HTMLElement) {
        const gridId = this.closest('.pill-grid')?.id
        const inputId = gridId === 'hero-duration-grid' ? 'hero-duration-input' : 'hero-revenue-input'
        selectPill(this, inputId, gridId || '')
      })
    })

    // Country selector
    const countrySelector = document.getElementById('country-selector')
    const countryFlag = document.getElementById('country-flag')
    const prefixSelect = document.getElementById('form-prefix') as HTMLSelectElement

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
        name: (document.getElementById('form-name') as HTMLInputElement).value.trim(),
        phone: (document.getElementById('form-phone') as HTMLInputElement).value.trim(),
        businessType: (document.getElementById('form-business-type') as HTMLInputElement).value.trim(),
        prefix: (document.getElementById('form-prefix') as HTMLSelectElement).value,
        isSeller: isAmazonSeller,
        sellingDuration: (document.getElementById('hero-duration-input') as HTMLInputElement)?.value || '',
        monthlyRevenue: (document.getElementById('hero-revenue-input') as HTMLInputElement)?.value || '',
        website: (document.getElementById('website-field') as HTMLInputElement)?.value || '', // Honeypot
      }

      // Validación básica del lado del cliente
      if (!formData.name || formData.name.length < 2) {
        throw new Error('Por favor, ingresa un nombre válido')
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
      formBtn.style.backgroundColor = '#0088c0'
      formBtn.innerHTML = '¡RECIBIDO! <i class="fa-solid fa-check"></i>'
      form.reset()
      
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
    <div className="form-card">
        <h2 className="form-title">Prueba nuestro Bot Demo ahora</h2>
        <form 
          id="signup-form" 
          className="smart-form" 
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="selling_duration" id="hero-duration-input" />
          <input type="hidden" name="monthly_revenue" id="hero-revenue-input" />
          
          {/* Honeypot field - invisible para bots */}
          <input
            type="text"
            id="website-field"
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
              id="form-name"
              className="form-input"
              placeholder="Nombre completo"
              required
            />
            <div className="error-message" id="name-error"></div>
          </div>
          <div className="input-group phone-group">
            <label htmlFor="form-prefix" className="sr-only">
              Prefijo telefónico
            </label>
            <div className="phone-prefix-wrapper">
              <div className="country-selector" id="country-selector">
                <div className="country-flag" id="country-flag" aria-hidden="true">🇪🇸</div>
                <select 
                  id="form-prefix" 
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
              id="form-phone"
              className="form-input form-phone-number"
              placeholder="Tu número de WhatsApp"
              required
            />
            <div className="error-message" id="phone-error"></div>
          </div>
          <div className="input-group">
            <input
              type="text"
              id="form-business-type"
              className="form-input"
              placeholder="Tipo de negocio (Peluquería, Clínica...)"
              required
            />
            <div className="error-message" id="email-error"></div>
          </div>
          
          <div className="amazon-switch-group">
            <span className="switch-label-text">¿Usas agenda digital actualmente?</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="form-amazon-seller"
                checked={isAmazonSeller}
                onChange={(e) => setIsAmazonSeller(e.target.checked)}
              />
              <span className="slider">
                <span className="txt-no">NO</span>
                <span className="txt-si">SÍ</span>
              </span>
            </label>
          </div>
          
          <div className={`expandable-fields ${isAmazonSeller ? 'open' : ''}`} id="hero-expandable">
            <span className="pill-label" id="duration-label">¿Cuánto tiempo llevas vendiendo?</span>
            <div className="pill-grid cols-3" id="hero-duration-grid">
              <div className="pill-btn" data-value="0-1 año">0-1 año</div>
              <div className="pill-btn" data-value="2-5 años">2-5 años</div>
              <div className="pill-btn" data-value="+5 años">+5 años</div>
            </div>
            <div className="error-message" id="duration-error"></div>
            
            <span className="pill-label" id="revenue-label">¿Facturación mensual?</span>
            <div className="pill-grid cols-4" id="hero-revenue-grid">
              <div className="pill-btn" data-value="0-5k">0-5k</div>
              <div className="pill-btn" data-value="5k-20k">5k-20k</div>
              <div className="pill-btn" data-value="20k-50k">20k-50k</div>
              <div className="pill-btn" data-value="+50k">+50k</div>
            </div>
            <div className="error-message" id="revenue-error"></div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'RECIBIR ACCESO AL BOT'}
          </button>
        </form>
      </div>
  )
}

