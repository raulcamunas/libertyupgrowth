import Link from 'next/link'

export default async function ExitoPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = (await searchParams) || {}
  const planRaw = sp.plan
  const plan = Array.isArray(planRaw) ? planRaw[0] : planRaw

  const stripe97 = 'https://buy.stripe.com/7sY5kC4Un5ecbYzczyfw405'
  const stripe77 = 'https://buy.stripe.com/6oU00idqT8qo3s37fefw404'
  const checkoutLink = plan === '77' ? stripe77 : stripe97

  return (
    <div className="blog-post-page">
      <div className="blog-post-container">
        <div className="blog-post-body">
          <h1>¡Contrato firmado con éxito!</h1>
          <p>
            Tu descarga debería haber comenzado.
          </p>
          <p>En breve te contactará el técnico en 24-48h si has realizado el pago.</p>
          <p>
            Si no has realizado el pago, aquí tienes el enlace para comenzar tus servicios:{' '}
            <a href={checkoutLink} target="_blank" rel="noreferrer">
              {checkoutLink}
            </a>
          </p>
          <p>
            <Link href="/">Volver a la página principal</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
