import Link from 'next/link'

export default function ExitoPage() {
  return (
    <div className="blog-post-page">
      <div className="blog-post-container">
        <div className="blog-post-body">
          <h1>¡Contrato firmado con éxito!</h1>
          <p>
            Tu descarga debería haber comenzado. En breve nos pondremos en contacto contigo para el alta
            técnica.
          </p>
          <p>
            <Link href="/">Volver a la página principal</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
