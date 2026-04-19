'use client'

import { usePathname } from 'next/navigation'

export default function WhatsAppWidget() {
  const pathname = usePathname()
  if (pathname.startsWith('/app')) return null

  // Nota: El evento de WhatsApp se captura automáticamente por GTM
  // mediante el trigger "Activador - Click Whatsapp" que detecta URLs con wa.me
  // No necesitamos enviar un evento personalizado adicional para evitar duplicación

  return (
    <div className="whatsapp-widget">
      <div className="whatsapp-message" id="whatsapp-message">
        Si necesitas ayuda, contáctanos
      </div>
      <div className="whatsapp-message" id="whatsapp-message-2">
        ¿Tienes dudas? Te las resolvemos
      </div>
      <a
        href="https://api.whatsapp.com/send?phone=34910792251&text=%C2%A1Hola!%20He%20visto%20vuestros%20servicios%20en%20vuestra%20web%20y%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20info%20%F0%9F%98%80"
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

