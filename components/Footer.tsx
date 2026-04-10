'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-section footer-brand">
            <Image
              src="/logo.png"
              alt="Liberty UpGrowth"
              className="footer-logo-img"
              width={140}
              height={35}
              loading="lazy"
            />
            <p className="footer-desc">
              Automatización con IA para que tu negocio atienda, convierta y agende sin fricción.
            </p>
          </div>
          <div className="footer-section footer-contact">
            <h3 className="footer-contact-title">Contacto</h3>
            <div className="contact-info">
              <a href="mailto:contacto@libertyupgrowth.es" className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <span>contacto@libertyupgrowth.es</span>
              </a>
              <a href="tel:+910626798" className="contact-item">
                <i className="fa-solid fa-phone"></i>
                <span>+ 34 910 62 67 98</span>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="copyright">© 2025 Liberty UpGrowth. Todos los derechos reservados.</div>
          <Link href="/politica-de-privacidad" className="footer-privacy-link">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}

