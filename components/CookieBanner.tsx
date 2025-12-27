'use client'

export default function CookieBanner() {
  return (
    <>
      {/* Cookie Banner */}
      <div className="cookie-banner" id="cookie-banner">
        <div className="cookie-banner-content">
          <div className="cookie-banner-text">
            <p>
              Utilizamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. Al hacer clic en "Aceptar", consientes el uso de cookies para análisis.{' '}
              <a href="#" id="cookie-info-link">
                Más información
              </a>
            </p>
          </div>
          <div className="cookie-banner-actions">
            <button className="cookie-btn cookie-btn-reject" id="cookie-reject">
              Rechazar
            </button>
            <button className="cookie-btn cookie-btn-accept" id="cookie-accept">
              Aceptar
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Info Modal */}
      <div className="cookie-info-modal" id="cookie-info-modal">
        <div className="cookie-info-modal-content">
          <div className="cookie-info-modal-header">
            <h2 className="cookie-info-modal-title">Política de Cookies</h2>
            <button className="cookie-info-modal-close" id="cookie-info-close">
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          <div className="cookie-info-modal-body">
            <h3>¿Qué son las cookies?</h3>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Nos ayudan a mejorar tu experiencia de navegación y a entender cómo utilizas nuestro sitio.
            </p>

            <h3>¿Qué cookies utilizamos?</h3>
            <p>Utilizamos las siguientes categorías de cookies:</p>
            <ul>
              <li>
                <strong>Cookies técnicas:</strong> Necesarias para el funcionamiento básico del sitio web.
              </li>
              <li>
                <strong>Cookies de análisis:</strong> Nos permiten analizar cómo los usuarios interactúan con nuestro sitio para mejorar su experiencia.
              </li>
              <li>
                <strong>Cookies de marketing:</strong> Utilizadas para mostrar contenido relevante y medir la efectividad de nuestras campañas publicitarias.
              </li>
            </ul>

            <h3>¿Cómo gestionar las cookies?</h3>
            <p>
              Puedes aceptar o rechazar las cookies mediante los botones del banner. También puedes configurar tu navegador para que te avise cuando se instalen cookies o para rechazarlas automáticamente. Ten en cuenta que rechazar algunas cookies puede afectar la funcionalidad del sitio.
            </p>

            <h3>Cookies de terceros</h3>
            <p>
              Utilizamos Google Tag Manager y Google Analytics para analizar el tráfico del sitio. Estas herramientas pueden instalar cookies en tu dispositivo según sus propias políticas de privacidad.
            </p>

            <h3>Más información</h3>
            <p>
              Si deseas más información sobre cómo utilizamos las cookies o sobre tus derechos de privacidad, puedes contactarnos a través de nuestro formulario de contacto.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

