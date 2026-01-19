'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isAmazonSeller, setIsAmazonSeller] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    // Toggle expandable fields
    const amazonToggle = document.getElementById('modal-form-amazon-seller') as HTMLInputElement
    const expandable = document.getElementById('modal-expandable')
    
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
    const pillButtons = document.querySelectorAll('#modal-expandable .pill-btn')
    pillButtons.forEach((btn) => {
      btn.addEventListener('click', function(this: HTMLElement) {
        const gridId = this.closest('.pill-grid')?.id
        const inputId = gridId === 'modal-duration-grid' ? 'modal-duration-input' : 'modal-revenue-input'
        selectPill(this, inputId, gridId || '')
      })
    })

    // Country selector
    const countryFlag = document.getElementById('modal-country-flag')
    const prefixSelect = document.getElementById('modal-form-prefix') as HTMLSelectElement

    prefixSelect?.addEventListener('change', function(this: HTMLSelectElement) {
      const selectedOption = this.options[this.selectedIndex]
      const flag = selectedOption.getAttribute('data-flag')
      if (countryFlag && flag) {
        countryFlag.textContent = flag
      }
    })

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      amazonToggle?.removeEventListener('change', handleToggle)
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
        isSeller: isAmazonSeller,
        sellingDuration: (document.getElementById('modal-duration-input') as HTMLInputElement)?.value || '',
        monthlyRevenue: (document.getElementById('modal-revenue-input') as HTMLInputElement)?.value || '',
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
        onClose()
        formBtn.disabled = false
        formBtn.style.backgroundColor = 'var(--brand-color)'
        formBtn.innerHTML = originalBtnText
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
            <input type="hidden" name="selling_duration" id="modal-duration-input" />
            <input type="hidden" name="monthly_revenue" id="modal-revenue-input" />
            
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
            
            <div className="amazon-switch-group">
              <span className="switch-label-text">¿Vendes en Amazon?</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  id="modal-form-amazon-seller"
                  checked={isAmazonSeller}
                  onChange={(e) => setIsAmazonSeller(e.target.checked)}
                />
                <span className="slider">
                  <span className="txt-no">NO</span>
                  <span className="txt-si">SÍ</span>
                </span>
              </label>
            </div>
            
            <div className={`expandable-fields ${isAmazonSeller ? 'open' : ''}`} id="modal-expandable">
              <span className="pill-label" id="modal-duration-label">¿Cuánto tiempo llevas vendiendo?</span>
              <div className="pill-grid cols-3" id="modal-duration-grid">
                <div className="pill-btn" data-value="0-1 año">0-1 año</div>
                <div className="pill-btn" data-value="2-5 años">2-5 años</div>
                <div className="pill-btn" data-value="+5 años">+5 años</div>
              </div>
              <div className="error-message" id="modal-duration-error"></div>
              
              <span className="pill-label" id="modal-revenue-label">¿Facturación mensual?</span>
              <div className="pill-grid cols-4" id="modal-revenue-grid">
                <div className="pill-btn" data-value="0-5k">0-5k</div>
                <div className="pill-btn" data-value="5k-20k">5k-20k</div>
                <div className="pill-btn" data-value="20k-50k">20k-50k</div>
                <div className="pill-btn" data-value="+50k">+50k</div>
              </div>
              <div className="error-message" id="modal-revenue-error"></div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : (isAmazonSeller ? 'AUDITAR MI CUENTA' : 'QUIERO EMPEZAR')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

