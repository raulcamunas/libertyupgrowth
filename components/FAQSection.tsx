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
                <span>¿Tenéis algún contrato de permanencia?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  No. En Liberty Seller no atamos a ningún cliente con contratos blindados. Creemos que la única razón para que te quedes con nosotros es que veas resultados mes a mes. Si no aportamos valor, eres libre de irte; no tiene sentido retenerte a la fuerza.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>¿Garantizáis resultados de venta?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Si alguien te garantiza ventas fijas en Amazon, <strong>huye</strong>. Nosotros somos honestos: el mercado fluctúa. Lo que sí garantizamos es una gestión profesional basada en datos y estrategias testadas en nuestras propias cuentas. No somos una agencia que &quot;prueba suerte&quot; con tu dinero, gestionamos tu capital con el mismo cuidado que el nuestro.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>¿Cómo estructuráis el precio?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Huimos de las tarifas estándar. Nuestro modelo se basa en el éxito compartido: cobramos un fijo ajustado para la operativa y un variable (generalmente un 5%) que se aplica <strong>exclusivamente sobre la facturación que supere</strong> lo que hiciste el año anterior en ese mismo mes. Si no mejoramos tus números históricos, no cobramos ese variable.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>Ya trabajé con agencias y perdí dinero en PPC, ¿qué haréis distinto?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Entendemos tu frustración. Muchos gestores disparan el gasto sin ton ni son. Nuestro enfoque es conservador: <strong>no quemamos dinero si el listing no convierte</strong>. Primero auditamos y reparamos el catálogo; solo invertimos en campañas cuando tenemos un ACOS controlado y el margen protegido.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>He escuchado que puedo empezar con 100€ o 1.000€, ¿es cierto?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Seamos honestos: muchos gurús te dirán eso, pero es falso. Si quieres montar un negocio real y no un hobby, necesitas estructura y stock. Para lanzar una tienda en condiciones y que funcione bien, la inversión mínima realista ronda los <strong>6.000€ - 8.000€</strong>. Amazon es un negocio serio y requiere darle el valor que merece.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>¿Trabajáis con cuentas nuevas o desde cero?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Sí. Gestionamos proyectos desde la fase semilla, como hicimos con clientes de Marca Privada. Te asesoramos desde la creación de la cuenta hasta la estrategia de lanzamiento, asegurando que empiezas con una base sólida y evitas los errores de novato que suelen costar mucho dinero.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>No tengo tiempo para gestionar la cuenta, ¿vosotros os encargáis?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Exacto. Ofrecemos una <strong>Gestión 360°</strong>. Nos convertimos en tu departamento de Amazon: desde la logística hasta hablar con el Soporte de Amazon para resolver incidencias. Tú supervisas el crecimiento, nosotros nos encargamos de toda la operativa diaria.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>¿Cómo sé si mi producto tiene potencial antes de invertir?</span>
                <div className="faq-toggle-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>
                  Antes de lanzarnos, realizamos una auditoría y análisis de mercado. No se trata de &quot;subir productos&quot;, sino de analizar la competencia y los márgenes reales. Si vemos que el producto no es viable, te lo diremos antes de que inviertas. Preferimos perder un cliente a que tú pierdas tus ahorros.
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

