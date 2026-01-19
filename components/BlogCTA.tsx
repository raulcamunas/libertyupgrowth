'use client'

import { useState } from 'react'
import ContactModal from './ContactModal'

export default function BlogCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="blog-post-cta">
        <div className="blog-post-cta-content">
          <h3 className="blog-post-cta-title">¿Listo para escalar tu cuenta de Amazon?</h3>
          <p className="blog-post-cta-text">
            Contacta con nosotros y descubre cómo podemos ayudarte a alcanzar tus objetivos.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="blog-post-cta-button"
          >
            <span>Empezar Ahora</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

