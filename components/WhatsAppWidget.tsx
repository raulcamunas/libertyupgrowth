'use client'

export default function WhatsAppWidget() {
  return (
    <div className="whatsapp-widget">
      <div className="whatsapp-message" id="whatsapp-message">
        Si necesitas ayuda, contáctanos
      </div>
      <div className="whatsapp-message" id="whatsapp-message-2">
        ¿Tienes dudas? Te las resolvemos
      </div>
      <a
        href="https://wa.me/910626798?text=Necesito%20ayuda%20sobre%20vuestros%20servicios"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        aria-label="Contactar por WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  )
}

