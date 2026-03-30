'use client'

import { useEffect, useState } from 'react'

export default function HeroForm() {
  const [usesDigitalAgenda, setUsesDigitalAgenda] = useState<string>('')
  const [employeesCount, setEmployeesCount] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eventSent, setEventSent] = useState(false)

  useEffect(() => {
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
        usaAgendaDigital: usesDigitalAgenda,
        empleados: employeesCount,
        website: (document.getElementById('website-field') as HTMLInputElement)?.value || '', // Honeypot
      }

      // Validación básica del lado del cliente
      if (!formData.name || formData.name.length < 2) {
        throw new Error('Por favor, ingresa un nombre válido')
      }
      if (!formData.phone || formData.phone.length < 8) {
        throw new Error('Por favor, ingresa un teléfono válido')
      }
      if (!formData.usaAgendaDigital) {
        throw new Error('Por favor, indica si usas agenda digital actualmente')
      }
      if (!formData.empleados) {
        throw new Error('Por favor, indica cuántos empleados tiene el negocio')
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
      setUsesDigitalAgenda('')
      setEmployeesCount('')
      
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
        <h2 className="form-title">Solicita acceso a la demo</h2>
        <form 
          id="signup-form" 
          className="smart-form" 
          onSubmit={handleSubmit}
        >
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
          
          <span className="pill-label">¿Usas agenda digital actualmente?</span>
          <div className="pill-grid cols-2" id="hero-agenda-grid">
            <button
              type="button"
              className={`pill-btn ${usesDigitalAgenda === 'No' ? 'active' : ''}`}
              onClick={() => setUsesDigitalAgenda('No')}
            >
              No
            </button>
            <button
              type="button"
              className={`pill-btn ${usesDigitalAgenda === 'Sí' ? 'active' : ''}`}
              onClick={() => setUsesDigitalAgenda('Sí')}
            >
              Sí
            </button>
          </div>

          <span className="pill-label">¿De cuántos empleados se compone el negocio?</span>
          <div className="pill-grid cols-2" id="hero-employees-grid">
            <button
              type="button"
              className={`pill-btn ${employeesCount === 'Solo yo' ? 'active' : ''}`}
              onClick={() => setEmployeesCount('Solo yo')}
            >
              Solo yo
            </button>
            <button
              type="button"
              className={`pill-btn ${employeesCount === '+2 personas' ? 'active' : ''}`}
              onClick={() => setEmployeesCount('+2 personas')}
            >
              +2 personas
            </button>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting || !usesDigitalAgenda || !employeesCount}
          >
            {isSubmitting ? 'Enviando...' : 'QUIERO QUE ME CONTACTEN'}
          </button>
        </form>
      </div>
  )
}

