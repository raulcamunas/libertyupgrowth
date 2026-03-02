'use client'

import { useEffect, useState } from 'react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Configuración de Brevo necesaria para el funcionamiento
      ;(window as any).REQUIRED_CODE_ERROR_MESSAGE = 'Elija un código de país'
      ;(window as any).LOCALE = 'es'
      ;(window as any).EMAIL_INVALID_MESSAGE = (window as any).SMS_INVALID_MESSAGE = 
        "La información que ha proporcionado no es válida. Compruebe el formato del campo e inténtelo de nuevo."
      ;(window as any).REQUIRED_ERROR_MESSAGE = "Este campo no puede quedarse vacío. "
      ;(window as any).GENERIC_INVALID_MESSAGE = 
        "La información que ha proporcionado no es válida. Compruebe el formato del campo e inténtelo de nuevo."
      
      ;(window as any).translation = {
        common: {
          selectedList: '{quantity} lista seleccionada',
          selectedLists: '{quantity} listas seleccionadas',
          selectedOption: '{quantity} seleccionado',
          selectedOptions: '{quantity} seleccionados',
        }
      }
      
      ;(window as any).AUTOHIDE = Boolean(0)
      
      // Cargar solo el script de Brevo (sin CSS)
      if (!document.querySelector('script[src*="sibforms.com"]')) {
        const script = document.createElement('script')
        script.defer = true
        script.src = 'https://sibforms.com/forms/end-form/build/main.js'
        document.body.appendChild(script)
      }
    }
  }, [])

  return (
    <div className="w-full">
      <div className="sib-form">
        <div id="sib-form-container" className="sib-form-container">
          {/* Mensaje de error - Oculto por defecto */}
          <div 
            id="error-message" 
            className="hidden mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            <div className="flex items-center gap-3">
              <svg 
                viewBox="0 0 512 512" 
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
              >
                <path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" />
              </svg>
              <span className="sib-form-message-panel__inner-text">
                No hemos podido validar su suscripción.
              </span>
            </div>
          </div>

          {/* Mensaje de éxito - Oculto por defecto */}
          <div 
            id="success-message" 
            className="hidden mb-5 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400"
          >
            <div className="flex items-center gap-3">
              <svg 
                viewBox="0 0 512 512" 
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
              >
                <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z" />
              </svg>
              <span className="sib-form-message-panel__inner-text">
                Se ha realizado su suscripción.
              </span>
            </div>
          </div>

          {/* Contenedor del formulario con estilo glassmorphism */}
          <div 
            id="sib-container" 
            className="sib-container--large sib-container--vertical bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-orange-500/[0.02] backdrop-blur-[30px] border border-orange-500/20 rounded-3xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.05)_inset,inset_0_1px_0_rgba(255,255,255,0.1)] text-center"
          >
            <form 
              id="sib-form" 
              method="POST" 
              action="https://7a617b13.sibforms.com/serve/MUIFAMUzWml_T9n5ZHF1y8hxbFc8IEUnOSlDPFzMd6fXIujpj7Evys0aErFdISMSYKkPccis4JouzN3obEvmXGrtxjTSD7b-5qnWqmDYaExsLXEhIQ7qBEPkcuasMTEgDP2vP1Oz4qYI2EjGLG212Kx-R6rsZTQOWrKYgX9YiMHA31h7seHhipAe-rwMYON8F83YrpN2LNkQGakP4w==" 
              data-type="subscription"
              className="space-y-6"
            >
              {/* Título */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Estrategias de Amazon que sí funcionan, cada viernes.
                </h3>
              </div>

              {/* Subtítulo */}
              <div>
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  Olvídate del spam. Recibe tácticas probadas de gestión y tips accionables para aplicar hoy mismo.
                </p>
              </div>

              {/* Campo de email */}
              <div className="space-y-2 max-w-md mx-auto">
                <label 
                  htmlFor="EMAIL" 
                  className="block text-sm font-semibold text-white mb-2 text-left"
                >
                  ¿Dónde te enviamos las estrategias?
                  <span className="text-orange-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  id="EMAIL"
                  name="EMAIL"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  data-required="true"
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] outline-none transition-all duration-300 focus:bg-white/[0.08] focus:border-orange-500 focus:shadow-[0_0_0_4px_rgba(255,102,0,0.1),0_2px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.05)] placeholder:text-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value
                    setEmail(value)
                    if (value === '') {
                      setEmailStatus('idle')
                    } else {
                      setEmailStatus(EMAIL_REGEX.test(value) ? 'valid' : 'invalid')
                    }
                  }}
                  style={{
                    WebkitTextFillColor: 'white',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                  }}
                />
                {/* Feedback visual del email */}
                {emailStatus === 'valid' && (
                  <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Gracias por suscribirte</span>
                  </div>
                )}
                {emailStatus === 'invalid' && email !== '' && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Por favor, introduce un email válido</span>
                  </div>
                )}
                {/* Mensaje de error del campo (manejado por Brevo) */}
                <label className="entry__error entry__error--primary hidden text-red-400 text-sm mt-1"></label>
              </div>

              {/* Botón de envío */}
              <div className="max-w-md mx-auto">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 py-[18px] px-9 bg-gradient-to-r from-[#FF6600] to-[#FF8533] hover:from-[#FF8533] hover:to-[#FF6600] text-white font-semibold text-base rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(255,102,0,0.3)] hover:shadow-[0_6px_30px_rgba(255,102,0,0.4)] hover:-translate-y-0.5"
                >
                  <span className="sib-form-block__button-text">ENVIADME LAS ESTRATEGIAS</span>
                  <svg 
                    className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon hidden" 
                    viewBox="0 0 512 512"
                    style={{ display: 'none' }}
                  >
                    <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                  </svg>
                </button>
              </div>

              {/* Campos ocultos requeridos por Brevo */}
              <input 
                type="text" 
                name="email_address_check" 
                defaultValue="" 
                className="hidden" 
                readOnly 
                aria-hidden="true"
              />
              <input type="hidden" name="locale" value="es" />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
