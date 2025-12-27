'use client'

import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-section footer-brand">
            <Image
              src="/logo.png"
              alt="LibertySeller - Agencia Amazon FBA"
              className="footer-logo-img"
              width={140}
              height={35}
              loading="lazy"
            />
            <p className="footer-desc">
              La agencia especializada en Amazon FBA que transforma cuentas estancadas en líderes de categoría. Gestionamos tu crecimiento con metodología basada en datos.
            </p>
          </div>
          <div className="footer-section footer-contact">
            <h3 className="footer-contact-title">Contacto</h3>
            <div className="contact-info">
              <a href="mailto:business@libertyseller.com" className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <span>business@libertyseller.com</span>
              </a>
              <a href="tel:+910626798" className="contact-item">
                <i className="fa-solid fa-phone"></i>
                <span>+ 34 910 62 67 98</span>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="copyright">© 2025 LibertySeller. Todos los derechos reservados.</div>
          <div className="social-icons">
            <a href="#" aria-label="Twitter">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

