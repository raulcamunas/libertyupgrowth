'use client'

import { useEffect } from 'react'

export default function NewsletterForm() {
  useEffect(() => {
    // Scripts de Brevo se cargarán automáticamente
    if (typeof window !== 'undefined') {
      ;(window as any).REQUIRED_CODE_ERROR_MESSAGE = 'Elija un código de país'
      ;(window as any).LOCALE = 'es'
      ;(window as any).EMAIL_INVALID_MESSAGE = (window as any).SMS_INVALID_MESSAGE = "La información que ha proporcionado no es válida. Compruebe el formato del campo e inténtelo de nuevo."
      ;(window as any).REQUIRED_ERROR_MESSAGE = "Este campo no puede quedarse vacío. "
      ;(window as any).GENERIC_INVALID_MESSAGE = "La información que ha proporcionado no es válida. Compruebe el formato del campo e inténtelo de nuevo."
      
      ;(window as any).translation = {
        common: {
          selectedList: '{quantity} lista seleccionada',
          selectedLists: '{quantity} listas seleccionadas',
          selectedOption: '{quantity} seleccionado',
          selectedOptions: '{quantity} seleccionados',
        }
      }
      
      ;(window as any).AUTOHIDE = Boolean(0)
      
      // Cargar el script de Brevo si no está cargado
      if (!document.querySelector('script[src*="sibforms.com"]')) {
        const script = document.createElement('script')
        script.defer = true
        script.src = 'https://sibforms.com/forms/end-form/build/main.js'
        document.body.appendChild(script)
      }
      
      // Cargar el CSS de Brevo si no está cargado
      if (!document.querySelector('link[href*="sib-styles.css"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://sibforms.com/forms/end-form/build/sib-styles.css'
        document.head.appendChild(link)
      }
      
      // Forzar estilos del input después de que Brevo cargue
      const forceInputStyles = () => {
        const emailInput = document.getElementById('EMAIL') as HTMLInputElement
        if (emailInput) {
          emailInput.style.setProperty('background', 'rgba(255, 255, 255, 0.05)', 'important')
          emailInput.style.setProperty('background-color', 'rgba(255, 255, 255, 0.05)', 'important')
          emailInput.style.setProperty('color', 'white', 'important')
          emailInput.style.setProperty('-webkit-text-fill-color', 'white', 'important')
          emailInput.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.1)', 'important')
        }
      }
      
      // Intentar forzar estilos inmediatamente y después de un delay
      forceInputStyles()
      setTimeout(forceInputStyles, 100)
      setTimeout(forceInputStyles, 500)
      setTimeout(forceInputStyles, 1000)
      
      // También usar MutationObserver para cuando el input se añada al DOM
      const observer = new MutationObserver(() => {
        forceInputStyles()
      })
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
      
      // Limpiar observer cuando el componente se desmonte
      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <>
      
      <div className="newsletter-form-wrapper">
        <div className="sib-form">
          <div id="sib-form-container" className="sib-form-container">
            <div id="error-message" className="sib-form-message-panel" style={{display: 'none'}}>
              <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon">
                  <path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" />
                </svg>
                <span className="sib-form-message-panel__inner-text">
                  No hemos podido validar su suscripción.
                </span>
              </div>
            </div>

            <div id="success-message" className="sib-form-message-panel" style={{display: 'none'}}>
              <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon">
                  <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z" />
                </svg>
                <span className="sib-form-message-panel__inner-text">
                  Se ha realizado su suscripción.
                </span>
              </div>
            </div>

            <div id="sib-container" className="sib-container--large sib-container--vertical">
              <form 
                id="sib-form" 
                method="POST" 
                action="https://7a617b13.sibforms.com/serve/MUIFAMUzWml_T9n5ZHF1y8hxbFc8IEUnOSlDPFzMd6fXIujpj7Evys0aErFdISMSYKkPccis4JouzN3obEvmXGrtxjTSD7b-5qnWqmDYaExsLXEhIQ7qBEPkcuasMTEgDP2vP1Oz4qYI2EjGLG212Kx-R6rsZTQOWrKYgX9YiMHA31h7seHhipAe-rwMYON8F83YrpN2LNkQGakP4w==" 
                data-type="subscription"
              >
                <div style={{padding: '8px 0'}}>
                  <div className="sib-form-block">
                    <p>Newsletter</p>
                  </div>
                </div>

                <div style={{padding: '8px 0'}}>
                  <div className="sib-form-block">
                    <div className="sib-text-form-block">
                      <p>Suscríbase a nuestra newsletter para recibir nuestras novedades.</p>
                    </div>
                  </div>
                </div>

                <div style={{padding: '8px 0'}}>
                  <div className="sib-input sib-form-block">
                    <div className="form__entry entry_block">
                      <div className="form__label-row">
                        <label 
                          className="entry__label" 
                          htmlFor="EMAIL" 
                          data-required="*"
                        >
                          Introduzca su dirección de e-mail para suscribirse
                        </label>
                        <div className="entry__field">
                          <input 
                            className="input" 
                            type="email" 
                            id="EMAIL" 
                            name="EMAIL" 
                            autoComplete="email" 
                            placeholder="tu@email.com" 
                            data-required="true" 
                            required 
                            style={{
                              width: '100%',
                              padding: '15px 20px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '12px',
                              color: 'white',
                              WebkitTextFillColor: 'white',
                              fontSize: '15px',
                              outline: 'none',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                              boxSizing: 'border-box',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              appearance: 'none'
                            } as React.CSSProperties}
                          />
                        </div>
                      </div>
                      <label className="entry__error entry__error--primary" style={{display: 'none'}}></label>
                      <label className="entry__specification">
                        Introduce tu dirección de e-mail para suscribirte. Ej.: abc@xyz.com
                      </label>
                    </div>
                  </div>
                </div>

                <div style={{padding: '8px 0'}}>
                  <div className="sib-form-block" style={{textAlign: 'left'}}>
                    <button 
                      className="sib-form-block__button sib-form-block__button-with-loader" 
                      form="sib-form" 
                      type="submit"
                    >
                      <svg className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon" viewBox="0 0 512 512" style={{display: 'none'}}>
                        <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                      </svg>
                      SUSCRIBIRSE
                    </button>
                  </div>
                </div>

                <input type="text" name="email_address_check" defaultValue="" className="input--hidden" readOnly style={{display: 'none'}} />
                <input type="hidden" name="locale" value="es" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

