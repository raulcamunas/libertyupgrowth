'use client'

export default function ProcessSection() {
  return (
    <section className="process-section" id="process-section">
      <div className="process-sticky-container">
        <div className="process-header">
          <div className="process-label scroll-trigger">• PROCESO DE ALTA</div>
          <h2 className="process-title scroll-trigger">Tu sistema, listo en 5 pasos</h2>
          <p className="process-subtitle scroll-trigger">
            Un despliegue rápido y guiado para que no tengas que preocuparte por la parte técnica. Nos encargamos de todo.
          </p>
        </div>

        <div className="process-wrapper scroll-trigger">
          <div className="process-line-container">
            <div className="process-line-bg"></div>
            <div className="process-line-fill" id="process-fill"></div>
          </div>

          <div className="process-step">
            <div className="step-node">
              <i className="fa-solid fa-phone" style={{ fontSize: '10px', color: 'white' }}></i>
            </div>
            <div className="step-content">
              <span className="step-num">PASO 01</span>
              <h3 className="step-title">Conexión Inicial</h3>
              <p className="step-desc">
                Contacta por formulario o WhatsApp. Analizamos tu volumen de citas para asegurar el mejor encaje con nuestra tecnología.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-node">
              <i className="fa-solid fa-calendar-check" style={{ fontSize: '10px', color: 'white' }}></i>
            </div>
            <div className="step-content">
              <span className="step-num">PASO 02</span>
              <h3 className="step-title">Diseño Estratégico</h3>
              <p className="step-desc">
                Diseñamos tu flujo ideal. Definimos servicios, horarios y la personalidad de tu IA para que actúe bajo tu propia lógica.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-node">
              <i className="fa-solid fa-chart-bar" style={{ fontSize: '10px', color: 'white' }}></i>
            </div>
            <div className="step-content">
              <span className="step-num">PASO 03</span>
              <h3 className="step-title">Setup de Reglas</h3>
              <p className="step-desc">
                Formalizamos el alta y configuramos tus reglas de negocio. Aquí es donde volcamos tu operativa real en el motor del bot.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-node">
              <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: '10px', color: 'white' }}></i>
            </div>
            <div className="step-content">
              <span className="step-num">PASO 04</span>
              <h3 className="step-title">Despliegue Técnico</h3>
              <p className="step-desc">
                Integramos Evolution API y Supabase. Un especialista testea el sistema en tiempo real hasta asegurar que el flujo es perfecto.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-node">
              <i className="fa-solid fa-globe" style={{ fontSize: '10px', color: 'white' }}></i>
            </div>
            <div className="step-content">
              <span className="step-num">PASO 05</span>
              <h3 className="step-title">Libertad Operativa</h3>
              <p className="step-desc">
                ¡Listo! Ya puedes acceder a tu dashboard y deja que el sistema trabaje por ti. Tu agenda se llena en automático.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="section-cta section-cta-mobile-only">
        <button
          className="section-cta-btn"
          onClick={(e) => {
            e.preventDefault()
            ;(window as any).scrollToForm?.()
          }}
        >
          <span>Empecemos juntos</span>
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </section>
  )
}

