'use client'

import { useEffect, useState } from 'react'

export default function HeroForm() {
  const [isAmazonSeller, setIsAmazonSeller] = useState(false)

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

  return (
    <div className="form-card">
      <h3 className="form-title">Solicita tu Auditoría o Plan de Lanzamiento</h3>
      <form id="signup-form" className="smart-form" method="POST">
        <input type="hidden" name="selling_duration" id="hero-duration-input" />
        <input type="hidden" name="monthly_revenue" id="hero-revenue-input" />
        
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
          <div className="phone-prefix-wrapper">
            <div className="country-selector" id="country-selector">
              <div className="country-flag" id="country-flag">🇪🇸</div>
              <select id="form-prefix" className="form-prefix-select" required>
                <option value="+34" data-flag="🇪🇸" defaultChecked>+34</option>
                <option value="+52" data-flag="🇲🇽">+52</option>
              </select>
              <i className="fa-solid fa-chevron-down prefix-arrow"></i>
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

        <button type="submit" className="submit-btn">
          TE CONTACTAMOS
        </button>
      </form>
    </div>
  )
}

