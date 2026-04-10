import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import '../styles/globals.css'
import CookieBanner from '@/components/CookieBanner'
import WhatsAppWidget from '@/components/WhatsAppWidget'

const inter = Inter({ subsets: ['latin'] })

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1222383833301915'

export const metadata: Metadata = {
  metadataBase: new URL('https://libertyupgrowth.es'),
  title: {
    default: 'Automatización con IA para agendar y convertir | Liberty UpGrowth',
    template: '%s | Liberty UpGrowth',
  },
  description:
    'Agencia de automatización con IA: atendemos por WhatsApp, convertimos leads y llenamos tu agenda en piloto automático. Integración completa y dashboard en tiempo real.',
  keywords: [
    'automatización IA',
    'automatización WhatsApp',
    'agendado automático',
    'IA para negocios',
    'bot WhatsApp',
    'n8n',
    'Supabase',
    'Evolution API',
  ],
  authors: [{ name: 'Liberty UpGrowth' }],
  creator: 'Liberty UpGrowth',
  publisher: 'Liberty UpGrowth',
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
    title: 'Automatización con IA para agendar y convertir | Liberty UpGrowth',
    description:
      'Automatización con IA por WhatsApp para atender, convertir y agendar sin fricción. Integración completa y dashboard en tiempo real.',
    url: 'https://libertyupgrowth.es',
    siteName: 'Liberty UpGrowth',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Liberty UpGrowth - Automatización con IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automatización con IA para agendar y convertir | Liberty UpGrowth',
    description:
      'Automatización con IA por WhatsApp para atender, convertir y agendar sin fricción. Integración completa y dashboard en tiempo real.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://libertyupgrowth.es',
  },
  verification: {
    // Añade aquí tus códigos de verificación cuando los tengas
    // google: 'tu-codigo-google',
    // yandex: 'tu-codigo-yandex',
    // bing: 'tu-codigo-bing',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00b5ff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect para recursos externos - Mejora performance móvil */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />

        {/* Favicon y Apple Touch Icon */}
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        
        {/* Font Awesome - Preload de fuentes críticas */}
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
        {/* Cargar Font Awesome CSS de forma ASÍNCRONA - no bloquea renderizado */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Cargar CSS después de que el contenido crítico se haya renderizado
                function loadFontAwesome() {
                  var link = document.createElement('link');
                  link.rel = 'stylesheet';
                  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
                  link.integrity = 'sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==';
                  link.crossOrigin = 'anonymous';
                  link.referrerPolicy = 'no-referrer';
                  document.head.appendChild(link);
                }
                // Cargar después de que el DOM esté listo pero sin bloquear
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', function() {
                    // Pequeño delay para no bloquear el renderizado inicial
                    setTimeout(loadFontAwesome, 50);
                  });
                } else {
                  setTimeout(loadFontAwesome, 50);
                }
              })();
            `,
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
            integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </noscript>

        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <CookieBanner />
        <WhatsAppWidget />

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        
        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Liberty UpGrowth',
              description:
                'Agencia de automatización con IA por WhatsApp: atendemos, convertimos y agendamos en piloto automático con integración completa y dashboard.',
              url: 'https://libertyupgrowth.es',
              logo: 'https://libertyupgrowth.es/logo.png',
              serviceType: 'AI Automation',
              areaServed: {
                '@type': 'Country',
                name: 'Spain',
              },
              offers: {
                '@type': 'Offer',
                description: 'Servicios de automatización con IA, bot de WhatsApp e integración (Evolution API + Supabase + n8n).',
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
              name: 'Liberty UpGrowth',
              url: 'https://libertyupgrowth.es',
              logo: 'https://libertyupgrowth.es/logo.png',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'contacto@libertyupgrowth.es',
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
                  name: '¿Es difícil de configurar en mi negocio?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Para nada. Nosotros nos encargamos de toda la parte técnica (integración de API y bases de datos). Tú solo defines tus horarios y servicios; nosotros hacemos que la magia ocurra.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Qué pasa si el bot no entiende a un cliente?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'El sistema está diseñado para detectar intenciones complejas. Si no puede resolver una duda, te notificará al instante o derivará la conversación a un humano para que no pierdas la cita.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Mis clientes se sentirán bien atendidos?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sí. No es un contestador rígido. Usamos IA con lenguaje natural que se adapta al tono de tu marca, ofreciendo una experiencia rápida, amable y mucho más eficiente que una espera al teléfono.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Puedo seguir agendando citas a mano?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Por supuesto. Tu nuevo Dashboard se sincroniza en tiempo real. Si tú añades una cita manualmente, el bot lo sabrá al segundo y no ofrecerá ese hueco a nadie más por WhatsApp.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Qué tecnología utilizáis exactamente?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Implementamos una infraestructura profesional basada en n8n para la lógica, Supabase para la seguridad de tus datos y Evolution API para conectar con tu número oficial de WhatsApp.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cómo es el modelo de pago?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Trabajamos con una inversión inicial de setup y una suscripción mensual de mantenimiento que cubre servidores, actualizaciones de la IA y soporte técnico continuo para que nunca dejes de agendar.',
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

