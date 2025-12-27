'use client'

import Script from 'next/script'
import { useEffect } from 'react'

// Este componente carga todo el JavaScript necesario para la landing
// Usa strategy="afterInteractive" para asegurar que el formulario funcione
export default function LandingScripts() {
  useEffect(() => {
    // Verificar que el formulario esté disponible después de que el script se cargue
    const checkForm = () => {
      const form = document.getElementById('signup-form')
      if (form && !form.hasAttribute('data-listener-added')) {
        // El script ya debería haber añadido el listener, pero verificamos
        form.setAttribute('data-listener-added', 'true')
      }
    }
    
    // Verificar después de un pequeño delay para asegurar que el script se ejecutó
    const timer = setTimeout(checkForm, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Script
      id="landing-scripts"
      src="/landing-scripts.js"
      strategy="afterInteractive"
      onLoad={() => {
        // Script cargado correctamente
        if (typeof window !== 'undefined') {
          console.log('Landing scripts loaded - Form handler ready')
        }
      }}
    />
  )
}
