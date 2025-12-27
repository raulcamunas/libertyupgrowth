import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import CookieBanner from '@/components/CookieBanner'
import WhatsAppWidget from '@/components/WhatsAppWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://libertyseller.es'),
  title: {
    default: 'Agencia Amazon FBA - Escala tus Ventas | Liberty Seller',
    template: '%s | Liberty Seller',
  },
  description: 'Agencia especializada en Amazon FBA. Reducimos tu ACOS, optimizamos PPC\'s y aumentamos tu Buy Box. Gestión 360° de tu cuenta Amazon con resultados medibles.',
  keywords: ['Amazon FBA', 'agencia Amazon', 'gestión Amazon', 'Amazon Seller', 'Amazon PPC', 'optimización Amazon', 'Amazon marketing', 'Amazon FBA España'],
  authors: [{ name: 'LibertySeller' }],
  creator: 'LibertySeller',
  publisher: 'LibertySeller',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Agencia Amazon FBA - Escala tus Ventas | LibertySeller',
    description: 'Agencia especializada en Amazon FBA. Gestionamos tus cuentas y disparamos tus ventas con inteligencia de mercado. +20.000€/mes de facturación para nuestros clientes.',
    url: 'https://libertyseller.es',
    siteName: 'Liberty Seller',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Liberty Seller - Agencia Amazon FBA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agencia Amazon FBA - Escala tus Ventas | LibertySeller',
    description: 'Agencia especializada en Amazon FBA. Gestionamos tus cuentas y disparamos tus ventas con inteligencia de mercado.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://libertyseller.es',
  },
  verification: {
    // Añade aquí tus códigos de verificación cuando los tengas
    // google: 'tu-codigo-google',
    // yandex: 'tu-codigo-yandex',
    // bing: 'tu-codigo-bing',
  },
}

export const viewport: Viewport = {
  themeColor: '#FF6600',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect para recursos externos - Mejora performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              // Consentimiento por defecto denegado
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'wait_for_update': 500
              });
              
              // Carga de GTM con tu ID: GTM-TF2CN86V
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TF2CN86V');
            `,
          }}
        />
        
        {/* Favicon y Apple Touch Icon */}
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        
        {/* Font Awesome - Carga crítica para iconos */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Preload Font Awesome para mejor performance */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-brands-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TF2CN86V"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Navbar />
        {children}
        <CookieBanner />
        <WhatsAppWidget />
        
        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'LibertySeller',
              description: 'Agencia especializada en Amazon FBA. Gestionamos tus cuentas y disparamos tus ventas con inteligencia de mercado.',
              url: 'https://libertyseller.es',
              logo: 'https://libertyseller.es/logo.png',
              serviceType: 'Amazon FBA Management',
              areaServed: {
                '@type': 'Country',
                name: 'Spain',
              },
              offers: {
                '@type': 'Offer',
                description: 'Servicios de gestión y optimización de cuentas Amazon FBA',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '20',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'LibertySeller',
              url: 'https://libertyseller.es',
              logo: 'https://libertyseller.es/logo.png',
              sameAs: [
                'https://twitter.com/libertyseller',
                'https://linkedin.com/company/libertyseller',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'business@libertyseller.com',
                telephone: '+34910626798',
                availableLanguage: 'Spanish',
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'ES',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: '¿Tenéis algún contrato de permanencia?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No. En Liberty Seller no atamos a ningún cliente con contratos blindados. Creemos que la única razón para que te quedes con nosotros es que veas resultados mes a mes. Si no aportamos valor, eres libre de irte; no tiene sentido retenerte a la fuerza.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Garantizáis resultados de venta?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Si alguien te garantiza ventas fijas en Amazon, huye. Nosotros somos honestos: el mercado fluctúa. Lo que sí garantizamos es una gestión profesional basada en datos y estrategias testadas en nuestras propias cuentas. No somos una agencia que "prueba suerte" con tu dinero, gestionamos tu capital con el mismo cuidado que el nuestro.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cómo estructuráis el precio?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Huimos de las tarifas estándar. Nuestro modelo se basa en el éxito compartido: cobramos un fijo ajustado para la operativa y un variable (generalmente un 5%) que se aplica exclusivamente sobre la facturación que supere lo que hiciste el año anterior en ese mismo mes. Si no mejoramos tus números históricos, no cobramos ese variable.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Ya trabajé con agencias y perdí dinero en PPC, ¿qué haréis distinto?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Entendemos tu frustración. Muchos gestores disparan el gasto sin ton ni son. Nuestro enfoque es conservador: no quemamos dinero si el listing no convierte. Primero auditamos y reparamos el catálogo; solo invertimos en campañas cuando tenemos un ACOS controlado y el margen protegido.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'He escuchado que puedo empezar con 100€ o 1.000€, ¿es cierto?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Seamos honestos: muchos gurús te dirán eso, pero es falso. Si quieres montar un negocio real y no un hobby, necesitas estructura y stock. Para lanzar una tienda en condiciones y que funcione bien, la inversión mínima realista ronda los 6.000€ - 8.000€. Amazon es un negocio serio y requiere darle el valor que merece.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Trabajáis con cuentas nuevas o desde cero?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sí. Gestionamos proyectos desde la fase semilla, como hicimos con clientes de Marca Privada. Te asesoramos desde la creación de la cuenta hasta la estrategia de lanzamiento, asegurando que empiezas con una base sólida y evitas los errores de novato que suelen costar mucho dinero.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'No tengo tiempo para gestionar la cuenta, ¿vosotros os encargáis?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Exacto. Ofrecemos una Gestión 360°. Nos convertimos en tu departamento de Amazon: desde la logística hasta hablar con el Soporte de Amazon para resolver incidencias. Tú supervisas el crecimiento, nosotros nos encargamos de toda la operativa diaria.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cómo sé si mi producto tiene potencial antes de invertir?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Antes de lanzarnos, realizamos una auditoría y análisis de mercado. No se trata de "subir productos", sino de analizar la competencia y los márgenes reales. Si vemos que el producto no es viable, te lo diremos antes de que inviertas. Preferimos perder un cliente a que tú pierdas tus ahorros.',
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}

