'use client'

export default function ShowcaseSnapSection() {
  return (
    <section className="showcase-snap" id="showcase-snap">
      <div className="showcase-snap__outer">
        <div className="showcase-snap__row showcase-snap__row--reverse">
          <div className="showcase-snap__visual">
            <img
              src="/whatsapp.png"
              alt="Conversación de WhatsApp con el bot"
              className="showcase-snap__image showcase-snap__image--whatsapp"
              loading="lazy"
            />
          </div>

          <div className="showcase-snap__copy">
            <div className="showcase-snap__label">• DELEGACIÓN TOTAL</div>
            <h2 className="showcase-snap__title">Tu negocio responde por ti</h2>
            <p className="showcase-snap__subtitle">
              Nuestra IA agenda, entiende el contexto y ofrece un trato impecable por WhatsApp. Es la libertad de saber
              que cada cliente es atendido mientras tú estás desconectado.
            </p>

            <ul className="showcase-snap__bullets">
              <li>
                <span className="showcase-snap__bullet-title">Autonomía Real:</span> El bot toma decisiones basadas en tus
                reglas.
              </li>
              <li>
                <span className="showcase-snap__bullet-title">Trato Premium:</span> Conversaciones naturales que refuerzan
                tu marca.
              </li>
              <li>
                <span className="showcase-snap__bullet-title">Conversión 24/7:</span> Ni una sola cita perdida por falta de
                respuesta.
              </li>
            </ul>
          </div>
        </div>

        <div className="showcase-snap__row">
          <div className="showcase-snap__copy">
            <div className="showcase-snap__label">• INFRAESTRUCTURA</div>
            <h2 className="showcase-snap__title">Lidera, no gestiones</h2>
            <p className="showcase-snap__subtitle">
              Un centro de mando intuitivo para supervisar tu agenda en tiempo real. Deja atrás el caos administrativo y
              recupera el control estratégico de tu empresa.
            </p>

            <ul className="showcase-snap__bullets">
              <li>
                <span className="showcase-snap__bullet-title">Sincronización Total:</span> WhatsApp y tu panel, siempre de
                la mano.
              </li>
              <li>
                <span className="showcase-snap__bullet-title">Métricas Clave:</span> Visualiza tus ingresos y el ahorro de
                tiempo real.
              </li>
              <li>
                <span className="showcase-snap__bullet-title">Simplicidad:</span> Diseñado para dueños de negocios, no
                para técnicos.
              </li>
            </ul>
          </div>

          <div className="showcase-snap__visual">
            <img
              src="/macbook.png"
              alt="Dashboard del cliente"
              className="showcase-snap__image showcase-snap__image--laptop"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
