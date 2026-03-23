'use client'

export default function FAQSection() {
  return (
    <div className="faq-cta-wrapper">
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-header-text">
            <h2 className="faq-title scroll-trigger">Preguntas Frecuentes</h2>
            <p className="faq-subtitle scroll-trigger">Resolvemos las dudas más comunes...</p>
          </div>
          <div className="faq-list scroll-trigger">
            <div className="faq-item">
              <div className="faq-question">
                <span>¿Es difícil de configurar en mi negocio?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Para nada. Nosotros nos encargamos de toda la parte técnica (integración de API y bases de datos). Tú solo defines tus horarios y servicios; nosotros hacemos que la magia ocurra.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>¿Qué pasa si el bot no entiende a un cliente?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  El sistema está diseñado para detectar intenciones complejas. Si no puede resolver una duda, te notificará al instante o derivará la conversación a un humano para que no pierdas la cita.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>¿Mis clientes se sentirán bien atendidos?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Sí. No es un contestador rígido. Usamos IA con lenguaje natural que se adapta al tono de tu marca, ofreciendo una experiencia rápida, amable y mucho más eficiente que una espera al teléfono.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>¿Puedo seguir agendando citas a mano?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Por supuesto. Tu nuevo Dashboard se sincroniza en tiempo real. Si tú añades una cita manualmente, el bot lo sabrá al segundo y no ofrecerá ese hueco a nadie más por WhatsApp.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>¿Qué tecnología utilizáis exactamente?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Implementamos una infraestructura profesional basada en n8n para la lógica, Supabase para la seguridad de tus datos y Evolution API para conectar con tu número oficial de WhatsApp.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>¿Cómo es el modelo de pago?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Trabajamos con una inversión inicial de setup y una suscripción mensual de mantenimiento que cubre servidores, actualizaciones de la IA y soporte técnico continuo para que nunca dejes de agendar.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="section-cta">
          <button
            className="section-cta-btn"
            onClick={(e) => {
              e.preventDefault()
              ;(window as any).scrollToForm?.()
            }}
          >
            <span>Resuelve tus dudas con nosotros</span>
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
      </section>
    </div>
  )
}

