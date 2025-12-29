'use client'

import { useEffect, useState, useRef } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => string
      execute: (widgetId: string) => Promise<string>
      reset: (widgetId: string) => void
    }
  }
}

export default function HeroForm() {
  const [isAmazonSeller, setIsAmazonSeller] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileReady, setTurnstileReady] = useState(false)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const isExecutingTurnstile = useRef<boolean>(false)

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

  // Inicializar Turnstile cuando el script esté listo
  useEffect(() => {
    const initTurnstile = () => {
      if (turnstileReady && turnstileRef.current && !turnstileWidgetId.current && window.turnstile) {
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
        console.log('🔧 Inicializando Turnstile:', { 
          hasSiteKey: !!siteKey, 
          hasRef: !!turnstileRef.current,
          siteKeyValue: siteKey?.substring(0, 10) + '...'
        })
        
        if (!siteKey) {
          console.error('❌ NEXT_PUBLIC_TURNSTILE_SITE_KEY no está configurado')
          return
        }
        
        try {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            theme: 'dark',
            size: 'invisible',
          })
          turnstileWidgetId.current = widgetId
          console.log('✅ Turnstile widget inicializado:', widgetId)
        } catch (error) {
          console.error('❌ Error al inicializar Turnstile:', error)
        }
      }
    }
    
    // Intentar inicializar inmediatamente
    initTurnstile()
    
    // Si no se inicializó, intentar de nuevo después de un pequeño delay
    if (!turnstileWidgetId.current && turnstileReady) {
      const timer = setTimeout(initTurnstile, 200)
      return () => clearTimeout(timer)
    }
  }, [turnstileReady])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const form = e.currentTarget
    const formBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
    const originalBtnText = formBtn.innerHTML

    try {
      // Obtener token de Turnstile - RESETEAR antes de ejecutar para obtener token fresco
      let turnstileToken = ''
      
      console.log('🔐 Turnstile check:', {
        hasWidgetId: !!turnstileWidgetId.current,
        hasTurnstile: !!window.turnstile,
        turnstileReady: turnstileReady
      })
      
      if (!turnstileWidgetId.current) {
        throw new Error('Widget no inicializado. Por favor, recarga la página.')
      }
      
      if (!window.turnstile) {
        throw new Error('Turnstile no disponible. Por favor, recarga la página.')
      }
      
      // Evitar ejecutar si ya está en proceso
      if (isExecutingTurnstile.current) {
        throw new Error('Verificación en proceso. Por favor, espera un momento.')
      }
      
      isExecutingTurnstile.current = true
      
      try {
        // Resetear el widget antes de ejecutar para obtener un token fresco
        try {
          window.turnstile.reset(turnstileWidgetId.current)
          // Esperar más tiempo para asegurar que el reset se complete completamente
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (resetError: any) {
          console.warn('⚠️ Error al resetear Turnstile:', resetError)
          // Si el reset falla, esperar un poco más antes de continuar
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        console.log('🔄 Ejecutando Turnstile...')
        
        // Intentar ejecutar con timeout
        const executePromise = window.turnstile.execute(turnstileWidgetId.current)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout al ejecutar Turnstile')), 10000)
        )
        
        turnstileToken = await Promise.race([executePromise, timeoutPromise]) as string
        
        if (!turnstileToken || turnstileToken.trim() === '') {
          throw new Error('No se pudo obtener el token de verificación. Por favor, intenta de nuevo.')
        }
        
        console.log('✅ Token obtenido:', turnstileToken.substring(0, 20) + '...')
      } catch (error: any) {
        console.error('❌ Error al ejecutar Turnstile:', error)
        
        // Si es el error 110200, es un problema de configuración
        if (error?.message?.includes('110200') || error?.code === '110200') {
          throw new Error('Error de configuración de Turnstile. Por favor, contacta al administrador.')
        }
        
        // Si es timeout, intentar una vez más
        if (error?.message?.includes('Timeout')) {
          console.log('🔄 Reintentando Turnstile después de timeout...')
          await new Promise(resolve => setTimeout(resolve, 1000))
          try {
            window.turnstile.reset(turnstileWidgetId.current)
            await new Promise(resolve => setTimeout(resolve, 500))
            turnstileToken = await window.turnstile.execute(turnstileWidgetId.current)
            if (!turnstileToken || turnstileToken.trim() === '') {
              throw new Error('No se pudo obtener el token después del reintento.')
            }
            console.log('✅ Token obtenido en reintento:', turnstileToken.substring(0, 20) + '...')
          } catch (retryError) {
            throw new Error('No se pudo obtener el token de verificación. Por favor, recarga la página e intenta de nuevo.')
          }
        } else {
          throw error
        }
      } finally {
        isExecutingTurnstile.current = false
      }

      // Verificar que el token se obtuvo correctamente antes de continuar
      if (!turnstileToken || turnstileToken.trim() === '') {
        throw new Error('No se pudo obtener el token de verificación. Por favor, intenta de nuevo.')
      }

      const formData = {
        name: (document.getElementById('form-name') as HTMLInputElement).value.trim(),
        phone: (document.getElementById('form-phone') as HTMLInputElement).value.trim(),
        email: (document.getElementById('form-email') as HTMLInputElement).value.trim(),
        prefix: (document.getElementById('form-prefix') as HTMLSelectElement).value,
        isSeller: isAmazonSeller,
        sellingDuration: (document.getElementById('hero-duration-input') as HTMLInputElement)?.value || '',
        monthlyRevenue: (document.getElementById('hero-revenue-input') as HTMLInputElement)?.value || '',
        website: (document.getElementById('website-field') as HTMLInputElement)?.value || '', // Honeypot
        cfTurnstileToken: turnstileToken,
      }
      
      // Verificación final antes de enviar
      if (!formData.cfTurnstileToken) {
        console.error('❌ Token no incluido en formData')
        throw new Error('Error de verificación. Por favor, recarga la página e intenta de nuevo.')
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

      console.log('📤 Enviando formulario con token:', !!formData.cfTurnstileToken)
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      console.log('📥 Respuesta del servidor:', response.status, data)

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
        formBtn.disabled = false
        formBtn.style.backgroundColor = 'var(--brand-color)'
        formBtn.innerHTML = originalBtnText
      }, 5000)

      // Resetear Turnstile
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current)
      }
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
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ Turnstile script cargado')
          // Pequeño delay para asegurar que window.turnstile esté disponible
          setTimeout(() => {
            if (window.turnstile) {
              setTurnstileReady(true)
            } else {
              console.error('❌ window.turnstile no disponible después de cargar el script')
            }
          }, 100)
        }}
        onError={(e) => {
          console.error('❌ Error al cargar Turnstile script:', e)
        }}
      />
      
      <div className="form-card">
        <h2 className="form-title">Solicita tu Auditoría o Plan de Lanzamiento</h2>
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
              placeholder="612 345 678"
              required
            />
            <div className="error-message" id="phone-error"></div>
          </div>
          <div className="input-group">
            <input
              type="email"
              id="form-email"
              className="form-input"
              placeholder="Correo electrónico"
              required
            />
            <div className="error-message" id="email-error"></div>
          </div>
          
          <div className="amazon-switch-group">
            <span className="switch-label-text">¿Vendes en Amazon?</span>
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

          {/* Cloudflare Turnstile widget (invisible pero presente en DOM) */}
          <div 
            ref={turnstileRef} 
            style={{ 
              position: 'absolute',
              width: '1px',
              height: '1px',
              opacity: 0,
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
          ></div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting || !turnstileReady}
          >
            {isSubmitting ? 'Enviando...' : 'TE CONTACTAMOS'}
          </button>
        </form>
      </div>
    </>
  )
}

