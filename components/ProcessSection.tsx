'use client'

export default function ProcessSection() {
  return (
    <section className="process-section" id="process-section">
      <div className="process-sticky-container">
        <div className="process-header">
          <h2 className="process-title scroll-trigger">Cómo lo hacemos</h2>
          <p className="process-subtitle scroll-trigger">
            Un proceso validado paso a paso. No hacemos testeos, replicamos lo que funciona.
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
              <h3 className="step-title">Llamada</h3>
              <p className="step-desc">
                Nos ponemos en contacto para una primera conversación sobre el estado actual de tu cuenta y tus objetivos.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-node">
              <i className="fa-solid fa-calendar-check" style={{ fontSize: '10px', color: 'white' }}></i>
            </div>
            <div className="step-content">
              <span className="step-num">PASO 02</span>
              <h3 className="step-title">Planificación</h3>
              <p className="step-desc">
                Trabajamos un periodo intenso de 3 meses para sanear tu cuenta y optimizarla para obtener los mejores resultados.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-node">
              <i className="fa-solid fa-chart-bar" style={{ fontSize: '10px', color: 'white' }}></i>
            </div>
            <div className="step-content">
              <span className="step-num">PASO 03</span>
              <h3 className="step-title">Mantenimiento</h3>
              <p className="step-desc">
                Analizamos el rendimiento de la cuenta después de nuestras acciones. Optimizamos para tener mejores resultados.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-node">
              <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: '10px', color: 'white' }}></i>
            </div>
            <div className="step-content">
              <span className="step-num">PASO 04</span>
              <h3 className="step-title">Escalado</h3>
              <p className="step-desc">
                Miramos nuevas oportunidades de inclusión de productos al catálogo para crecer horizontalmente.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-node">
              <i className="fa-solid fa-globe" style={{ fontSize: '10px', color: 'white' }}></i>
            </div>
            <div className="step-content">
              <span className="step-num">PASO 05</span>
              <h3 className="step-title">Expansión</h3>
              <p className="step-desc">
                Planificamos la internacionalización de tu cuenta para crecer verticalmente de manera exponencial.
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

