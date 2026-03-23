'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const menuItems = [
    { href: '/', label: 'HOME' },
    { href: '/#servicios', label: 'SERVICIOS' },
    { href: '/#testimonios', label: 'TESTIMONIOS' },
    { href: '/blog', label: 'BLOG' },
  ]

  const handleLinkClick = (href: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
    // Solo interceptar enlaces con hash (#)
    if (href.startsWith('/#')) {
      if (e) {
        e.preventDefault()
      }
      
      // Si estamos en la home, hacer scroll directamente
      if (pathname === '/') {
        const id = href.substring(2)
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } else {
        // Si estamos en otra página, redirigir a la home con el hash
        window.location.href = href
      }
    }
    // Para enlaces normales (como /blog), dejar que Next.js maneje la navegación
    // Solo cerramos el menú
    setIsOpen(false)
  }

  return (
    <>
      {/* Botón Hamburguesa */}
      <button
        className={`minimal-menu-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <div className="hamburger-container">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>
      </button>

      {/* Menú Full Screen */}
      <div className={`minimal-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-wrapper">
          {/* Header del Menú */}
          <div className="menu-header">
            <div className="menu-status">
              <span className="status-dot"></span>
              <span className="status-text">MENU</span>
            </div>
          </div>

          {/* Separador */}
          <div className="menu-divider"></div>

          {/* Lista de Navegación */}
          <ul className="minimal-menu-list">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href === '/' && pathname === '/')
              return (
                <li 
                  key={item.href} 
                  className="minimal-menu-item"
                  style={{ '--delay': `${index * 0.08}s` } as React.CSSProperties}
                >
                  <Link
                    href={item.href}
                    className={`minimal-menu-link ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleLinkClick(item.href, e)}
                  >
                    {isActive && <span className="menu-indicator"></span>}
                    <span className="menu-link-label">{item.label}</span>
                  </Link>
                  {index < menuItems.length - 1 && <div className="menu-item-divider"></div>}
                </li>
              )
            })}
          </ul>

          {/* Contact Section */}
          <div className="menu-contact">
            <div className="contact-section">
              <div className="contact-label">(EMAIL)</div>
              <div className="contact-links">
                <a href="mailto:contacto@libertyupgrowth.es" className="contact-link" aria-label="Email">
                  <i className="fa-solid fa-envelope"></i>
                  <span>contacto@libertyupgrowth.es</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
