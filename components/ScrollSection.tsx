'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

export default function ScrollSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageSrc, setCurrentImageSrc] = useState('')
  const [currentImageAlt, setCurrentImageAlt] = useState('')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const modalImageRef = useRef<HTMLImageElement>(null)
  const modalContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Asegurar que el script de zoom se ejecute después de que el DOM esté listo
    // El script landing-scripts.js ya maneja los event listeners
    // Solo necesitamos asegurarnos de que las imágenes tengan el cursor pointer
    const desktopImages = document.querySelectorAll('.scroll-result-img')
    const mobileImages = document.querySelectorAll('.mobile-result-img')
    
    desktopImages.forEach((img) => {
      ;(img as HTMLElement).style.cursor = 'pointer'
    })
    
    mobileImages.forEach((img) => {
      ;(img as HTMLElement).style.cursor = 'pointer'
    })

    // Exponer funciones globalmente para compatibilidad con el script
    ;(window as any).openImageModal = (src: string, alt: string) => {
      setCurrentImageSrc(src)
      setCurrentImageAlt(alt)
      setIsModalOpen(true)
      setZoomLevel(1)
      setTranslateX(0)
      setTranslateY(0)
    }

    ;(window as any).closeMobileResultModal = () => {
      setIsModalOpen(false)
      setZoomLevel(1)
      setTranslateX(0)
      setTranslateY(0)
    }

    ;(window as any).mobileZoomIn = () => {
      setZoomLevel((prev) => Math.min(prev + 0.5, 5))
    }

    ;(window as any).mobileZoomOut = () => {
      setZoomLevel((prev) => Math.max(prev - 0.5, 1))
    }

    ;(window as any).mobileResetZoom = () => {
      setZoomLevel(1)
      setTranslateX(0)
      setTranslateY(0)
    }
  }, [])

  useEffect(() => {
    if (modalImageRef.current) {
      modalImageRef.current.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`
    }
  }, [zoomLevel, translateX, translateY])

  const handleImageClick = (src: string, alt: string) => {
    // Asegurar que la ruta sea absoluta si es necesario
    const imageSrc = src.startsWith('/') ? src : `/${src}`
    setCurrentImageSrc(imageSrc)
    setCurrentImageAlt(alt)
    setIsModalOpen(true)
    setZoomLevel(1)
    setTranslateX(0)
    setTranslateY(0)
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
    setTranslateX(0)
    setTranslateY(0)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setZoomLevel(1)
    setTranslateX(0)
    setTranslateY(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1 && modalContainerRef.current) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - modalContainerRef.current.offsetLeft - translateX,
        y: e.clientY - modalContainerRef.current.offsetTop - translateY,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1 && modalContainerRef.current) {
      const x = e.clientX - modalContainerRef.current.offsetLeft - dragStart.x
      const y = e.clientY - modalContainerRef.current.offsetTop - dragStart.y
      setTranslateX(x)
      setTranslateY(y)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  return (
    <section className="scroll-section" id="scroll-section">
      <div className="scroll-bg-layer"></div>
      <div className="scroll-intro">
        <h2 className="scroll-title scroll-trigger">Resultados que hablan por sí solos</h2>
        <p className="scroll-subtitle scroll-trigger">
          No nos basamos en promesas vacías. Nuestra metodología basada en datos transforma cuentas estancadas en líderes de categoría.
        </p>
      </div>

      <div className="sticky-wrapper scroll-trigger">
        <div className="sticky-col">
          <div className="scroll-menu">
            <div className="scroll-menu-item active" id="menu-1">
              <div className="menu-dot"></div>
              <span>Explotamos tu rentabilidad</span>
            </div>
            <div className="scroll-menu-item" id="menu-2">
              <div className="menu-dot"></div>
              <span>OPTIMIZACIÓN ACOS</span>
            </div>
            <div className="scroll-menu-item" id="menu-3">
              <div className="menu-dot"></div>
              <span>Optimización de Buy Box</span>
            </div>
            <div className="scroll-menu-item" id="menu-4">
              <div className="menu-dot"></div>
              <span>Productos Rentables</span>
            </div>
            <div className="scroll-menu-item" id="menu-5">
              <div className="menu-dot"></div>
              <span>INTERNACIONALIZACIÓN</span>
            </div>
          </div>
        </div>
        <div className="scroll-center">
          <div className="scroll-visual-item active" data-step="1">
            <Image
              src="/testimonio1.png"
              alt="Resultado: Incremento a 20.000€ de facturación el 3er mes"
              className="scroll-result-img"
              width={800}
              height={600}
              loading="lazy"
              style={{ cursor: 'pointer' }}
              onClick={() => handleImageClick('/testimonio1.png', 'Resultado: Incremento a 20.000€ de facturación el 3er mes')}
            />
          </div>
          <div className="scroll-visual-item" data-step="2">
            <Image
              src="/testimonio2.png"
              alt="Resultado: ACOS reducido al 18%"
              className="scroll-result-img"
              width={800}
              height={600}
              loading="lazy"
              style={{ cursor: 'pointer' }}
              onClick={() => handleImageClick('/testimonio2.png', 'Resultado: ACOS reducido al 18%')}
            />
          </div>
          <div className="scroll-visual-item" data-step="3">
            <Image
              src="/testimonio3.png"
              alt="Resultado: Incremento 13% Buy Box"
              className="scroll-result-img"
              width={800}
              height={600}
              loading="lazy"
              style={{ cursor: 'pointer' }}
              onClick={() => handleImageClick('/testimonio3.png', 'Resultado: Incremento 13% Buy Box')}
            />
          </div>
          <div className="scroll-visual-item" data-step="4">
            <Image
              src="/testimonio4.png"
              alt="Resultado: Márgenes del 20-25% - Marca Privada"
              className="scroll-result-img"
              width={800}
              height={600}
              loading="lazy"
              style={{ cursor: 'pointer' }}
              onClick={() => handleImageClick('/testimonio4.png', 'Resultado: Márgenes del 20-25% - Marca Privada')}
            />
          </div>
          <div className="scroll-visual-item" data-step="5">
            <Image
              src="/testimonio5.png"
              alt="Resultado: +7 paises - Internacionalización"
              className="scroll-result-img"
              width={800}
              height={600}
              loading="lazy"
              style={{ cursor: 'pointer' }}
              onClick={() => handleImageClick('/testimonio5.png', 'Resultado: +7 paises - Internacionalización')}
            />
          </div>
        </div>
        <div className="sticky-col">
          <div className="right-text-container">
            <div className="right-text-block active" id="text-1">
              <h3 className="right-title">Lanzamiento de una tienda de naranjas</h3>
              <p className="right-desc">
                Una empresa que vende naranjas nos contactó porque muchas agencias le dijeron que no trabajan con este tipo de negocios.
              </p>
              <span className="right-stat-label">Resultado</span>
              <span className="right-stat-big">+20.000€/mes</span>
            </div>
            <div className="right-text-block" id="text-2">
              <h3 className="right-title">Sin miedo a las PPC&apos;s</h3>
              <p className="right-desc">
                Nuestro cliente nos contactó porque tenia autenticos destrozos en sus campañas publicitarias. Nosotros tomamos el control de todo y bajamos el acos a un 12% (y bajando), consiguiendo para él unas campañas altamente rentable por los margenes de sus productos
              </p>
              <span className="right-stat-label">EFICIENCIA</span>
              <span className="right-stat-big">ACOS 12%</span>
            </div>
            <div className="right-text-block" id="text-3">
              <h3 className="right-title">Aumento de Buy Box</h3>
              <p className="right-desc">
                Un cliente trabaja con marcas de terceros, contaba con un buy box de 2-3%. Trabajando su catalgo y analizando margenes conseguimos aumentar su buy box en picos de 24-25% y una sostenibilidad permanente de un 13%.
              </p>
              <span className="right-stat-label">Buy Box</span>
              <span className="right-stat-big">Incremento 13%</span>
            </div>
            <div className="right-text-block" id="text-4">
              <h3 className="right-title">Lanzamientos Marca Privada</h3>
              <p className="right-desc">
                Varios clientes nos contactan para que lancemos sus tiendas con productos rentables para su venta en amazon. Analizamos productos perfil bajo y armamos una tienda llena de productos con margenes altos y con control absoluto de la situación.
              </p>
              <span className="right-stat-label">Marca Privada</span>
              <span className="right-stat-big">Márgenes del 20-25%</span>
            </div>
            <div className="right-text-block" id="text-5">
              <h3 className="right-title">Internacionalización Controlada</h3>
              <p className="right-desc">
                Nuestro plan de escalada cuenta con la internacionalización. Aumenta hasta un x5 tu facturación vendiendo en todos los países de Europa o da el salto a vender tus productos a estados unidos, mexico y canada. Gestionamos tu crecimiento y te acompañamos en todo momento.
              </p>
              <span className="right-stat-label">Expansión</span>
              <span className="right-stat-big">+7 paises</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-results-list scroll-trigger">
        <div className="mobile-result-card">
          <h3>Lanzamiento de una tienda de naranjas</h3>
          <p>Una empresa que vende naranjas nos contactó porque muchas agencias le dijeron que no trabajan con este tipo de negocios.</p>
          <Image
            src="/testimonio1.png"
            alt="Resultado: +20.000€/mes - Caso de éxito LibertySeller"
            className="mobile-result-img"
            width={400}
            height={300}
            loading="lazy"
            style={{ cursor: 'pointer' }}
            onClick={() => handleImageClick('/testimonio1.png', 'Resultado: +20.000€/mes - Caso de éxito LibertySeller')}
          />
          <span className="mobile-stat-label">Resultado</span>
          <span className="mobile-stat-big">+20.000€/mes</span>
        </div>
        <div className="mobile-result-card">
          <h3>Sin miedo a las PPC&apos;s</h3>
          <p>
            Nuestro cliente nos contactó porque tenia autenticos destrozos en sus campañas publicitarias. Nosotros tomamos el control de todo y bajamos el acos a un 12% (y bajanado), consiguiendo para él unas campañas altamente rentable por los margenes de sus productos
          </p>
          <Image
            src="/testimonio2.png"
            alt="Resultado: ACOS reducido al 18% - Optimización PPC LibertySeller"
            className="mobile-result-img"
            width={400}
            height={300}
            loading="lazy"
            style={{ cursor: 'pointer' }}
            onClick={() => handleImageClick('/testimonio2.png', 'Resultado: ACOS reducido al 18% - Optimización PPC LibertySeller')}
          />
          <span className="mobile-stat-label">EFICIENCIA</span>
          <span className="mobile-stat-big">ACOS 12%</span>
        </div>
        <div className="mobile-result-card">
          <h3>Aumento de Buy Box</h3>
          <p>
            Un cliente trabaja con marcas de terceros, contaba con un buy box de 2-3%. Trabajando su catalgo y analizando margenes conseguimos aumentar su buy box en picos de 24-25% y una sostenibilidad permanente de un 13%.
          </p>
          <Image
            src="/testimonio3.png"
            alt="Resultado: Incremento 13% Buy Box - Optimización Buy Box LibertySeller"
            className="mobile-result-img"
            width={400}
            height={300}
            loading="lazy"
            style={{ cursor: 'pointer' }}
            onClick={() => handleImageClick('/testimonio3.png', 'Resultado: Incremento 13% Buy Box - Optimización Buy Box LibertySeller')}
          />
          <span className="mobile-stat-label">Buy Box</span>
          <span className="mobile-stat-big">Incremento 13%</span>
        </div>
        <div className="mobile-result-card">
          <h3>Lanzamientos Marca Privada</h3>
          <p>
            Varios clientes nos contactan para que lancemos sus tiendas con productos rentables para su venta en amazon. Analizamos productos perfil bajo y armamos una tienda llena de productos con margenes altos y con control absoluto de la situación.
          </p>
          <Image
            src="/testimonio4.png"
            alt="Resultado: Márgenes del 20-25% - Marca Privada LibertySeller"
            className="mobile-result-img"
            width={400}
            height={300}
            loading="lazy"
            style={{ cursor: 'pointer' }}
            onClick={() => handleImageClick('/testimonio4.png', 'Resultado: Márgenes del 20-25% - Marca Privada LibertySeller')}
          />
          <span className="mobile-stat-label">Marca Privada</span>
          <span className="mobile-stat-big">Márgenes del 20-25%</span>
        </div>
        <div className="mobile-result-card">
          <h3>Internacionalización controlada</h3>
          <p>
            Nuestro plan de escalada cuenta con la internacionalización. Aumenta hasta un x5 tu facturación vendiendo en todos los países de Europa o da el salto a vender tus productos a Estados Unidos, México y Canadá. Gestionamos tu crecimiento y te acompañamos en todo momento.
          </p>
          <Image
            src="/testimonio5.png"
            alt="Resultado: +7 paises - Internacionalización LibertySeller"
            className="mobile-result-img"
            width={400}
            height={300}
            loading="lazy"
            style={{ cursor: 'pointer' }}
            onClick={() => handleImageClick('/testimonio5.png', 'Resultado: +7 paises - Internacionalización LibertySeller')}
          />
          <span className="mobile-stat-label">Expansión</span>
          <span className="mobile-stat-big">+7 paises</span>
        </div>
      </div>

      {/* Modal para zoom de imágenes de resultados */}
      {isModalOpen && (
        <div 
          className="mobile-result-modal active" 
          id="mobile-result-modal"
          onClick={handleModalClick}
        >
          <button
            className="modal-close"
            onClick={handleCloseModal}
          >
            <i className="fa-solid fa-times"></i>
          </button>
          <div 
            className="modal-image-container" 
            id="modal-image-container"
            ref={modalContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              id="modal-result-img" 
              src={currentImageSrc} 
              alt={currentImageAlt} 
              className="modal-result-img"
              ref={modalImageRef}
              draggable={false}
            />
            <div className="zoom-controls">
              <button
                className="zoom-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomIn()
                }}
                title="Acercar"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
              <button
                className="zoom-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomOut()
                }}
                title="Alejar"
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <button
                className="zoom-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleResetZoom()
                }}
                title="Restablecer"
              >
                <i className="fa-solid fa-rotate-left"></i>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="section-cta">
        <button
          className="section-cta-btn"
          onClick={(e) => {
            e.preventDefault()
            ;(window as any).scrollToForm?.()
          }}
        >
          <span>Quiero estos resultados</span>
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </section>
  )
}

