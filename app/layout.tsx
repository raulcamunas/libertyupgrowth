import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import CookieBanner from '@/components/CookieBanner'
import WhatsAppWidget from '@/components/WhatsAppWidget'

const inter = Inter({ subsets: ['latin'] })

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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://tracker.metricool.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://tracker.metricool.com" />
        
        {/* Google Tag Manager - Carga diferida para mejorar LCP */}
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
              
              // Carga diferida de GTM - después de que la página esté lista
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  setTimeout(function() {
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-TF2CN86V');
                  }, 2000);
                });
              } else {
                setTimeout(function() {
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-TF2CN86V');
                }, 2000);
              }
            `,
          }}
        />
        
        
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
        {/* Metricool Tracking Pixel */}
        <img 
          src="https://tracker.metricool.com/c3po.jpg?hash=b6dd3a44243032207684cc5e12b106b" 
          alt="" 
          style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
        />
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

