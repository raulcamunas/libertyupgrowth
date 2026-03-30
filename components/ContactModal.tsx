'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [usesDigitalAgenda, setUsesDigitalAgenda] = useState<string>('')
  const [employeesCount, setEmployeesCount] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [eventSent, setEventSent] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    // Country selector
    const countryFlag = document.getElementById('modal-country-flag')
    const prefixSelect = document.getElementById('modal-form-prefix') as HTMLSelectElement

    const handlePrefixChange = function(this: HTMLSelectElement) {
      const selectedOption = this.options[this.selectedIndex]
      const flag = selectedOption.getAttribute('data-flag')
      if (countryFlag && flag) {
        countryFlag.textContent = flag
      }
    }

    prefixSelect?.addEventListener('change', handlePrefixChange)

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      prefixSelect?.removeEventListener('change', handlePrefixChange)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const form = e.currentTarget
    const formBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
    const originalBtnText = formBtn.innerHTML

    try {
      const formData = {
        name: (document.getElementById('modal-form-name') as HTMLInputElement).value.trim(),
        phone: (document.getElementById('modal-form-phone') as HTMLInputElement).value.trim(),
        email: (document.getElementById('modal-form-email') as HTMLInputElement).value.trim(),
        prefix: (document.getElementById('modal-form-prefix') as HTMLSelectElement).value,
        usaAgendaDigital: usesDigitalAgenda,
        empleados: employeesCount,
        website: (document.getElementById('modal-website-field') as HTMLInputElement)?.value || '', // Honeypot
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
      formBtn.style.backgroundColor = '#005b99'
      formBtn.textContent = 'Alguien del equipo te contactará lo antes posible.'
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
        onClose()
        formBtn.disabled = false
        formBtn.style.backgroundColor = 'var(--brand-color)'
        formBtn.innerHTML = originalBtnText
        setEventSent(false) // Reset para permitir otro envío
      }, 2000)
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

  if (!mounted || !isOpen) return null

  const modalContent = (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <h2 className="contact-modal-title">Solicita tu Auditoría o Plan de Lanzamiento</h2>
          <button
            type="button"
            onClick={onClose}
            className="contact-modal-close"
            aria-label="Cerrar modal"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="contact-modal-body">
          <form 
            id="modal-signup-form" 
            className="smart-form" 
            onSubmit={handleSubmit}
          >
            {/* Honeypot field - invisible para bots */}
            <input
              type="text"
              id="modal-website-field"
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
                id="modal-form-name"
                className="form-input"
                placeholder="Nombre completo"
                required
              />
              <div className="error-message" id="modal-name-error"></div>
            </div>
            <div className="input-group phone-group">
              <label htmlFor="modal-form-prefix" className="sr-only">
                Prefijo telefónico
              </label>
              <div className="phone-prefix-wrapper">
                <div className="country-selector" id="modal-country-selector">
                  <div className="country-flag" id="modal-country-flag" aria-hidden="true">🇪🇸</div>
                  <select 
                    id="modal-form-prefix" 
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
                id="modal-form-phone"
                className="form-input form-phone-number"
                placeholder="612 345 678"
                required
              />
              <div className="error-message" id="modal-phone-error"></div>
            </div>
            <div className="input-group">
              <input
                type="email"
                id="modal-form-email"
                className="form-input"
                placeholder="Correo electrónico"
                required
              />
              <div className="error-message" id="modal-email-error"></div>
            </div>
            
            <span className="pill-label">¿Usas agenda digital actualmente?</span>
            <div className="pill-grid cols-2" id="modal-agenda-grid">
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
            <div className="pill-grid cols-2" id="modal-employees-grid">
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
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

