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
    if (e) {
      e.preventDefault()
    }
    
    if (href.startsWith('/#')) {
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
    setIsOpen(false)
  }

  return null // Navbar oculta en rama main
}
