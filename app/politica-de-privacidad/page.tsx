import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Liberty UpGrowth',
  description:
    'Política de privacidad de Liberty UpGrowth sobre el tratamiento de datos personales, finalidades, base legal, conservación y derechos del usuario.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PoliticaDePrivacidadPage() {
  return (
    <div className="blog-post-page">
      <div className="blog-post-container">
        <div className="blog-post-body">
          <h1>Política de Privacidad</h1>

          <p>
            En Liberty UpGrowth nos tomamos muy en serio la privacidad. Esta Política de Privacidad explica
            cómo recopilamos, utilizamos y protegemos los datos personales que nos facilitas a través de
            nuestra web, formularios y canales de contacto.
          </p>

          <p>
            <strong>Última actualización:</strong> 10/04/2026
          </p>

          <h2>1. Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento de tus datos personales es <strong>Liberty UpGrowth LLC</strong>,
            con domicilio principal en <strong>99 Wall Street #1068, New York, New York, 10005 (USA)</strong>.
            La dirección postal coincide con la dirección indicada.
          </p>

          <h3>Agente registrado (Registered Agent)</h3>
          <p>
            El agente registrado es <strong>Registered Agents Inc</strong>, con oficina registrada en{' '}
            <strong>1209 MOUNTAIN ROAD PL NE, STE R, ALBUQUERQUE, NM 87110 (USA)</strong>, para la
            recepción de notificaciones y servicio de proceso. Esta información puede cambiar en cualquier
            momento mediante la correspondiente actualización ante el organismo competente.
          </p>

          <h2>2. Datos que recopilamos</h2>
          <p>
            Dependiendo de cómo interactúes con la web, podemos recopilar los siguientes datos:
          </p>
          <ul>
            <li>
              <strong>Datos identificativos y de contacto</strong>: nombre, teléfono, correo electrónico.
            </li>
            <li>
              <strong>Datos del negocio</strong>: tipo de negocio y respuestas a preguntas del formulario
              (por ejemplo, si utilizas agenda digital o tamaño del equipo).
            </li>
            <li>
              <strong>Datos técnicos</strong>: dirección IP, información del navegador/dispositivo y
              métricas de uso, cuando corresponda.
            </li>
          </ul>

          <h2>3. Finalidades del tratamiento</h2>
          <p>Tratamos tus datos personales para las siguientes finalidades:</p>
          <ul>
            <li>
              <strong>Gestionar solicitudes</strong>: responder a tu petición de información, consulta,
              contacto o acceso a la demo.
            </li>
            <li>
              <strong>Prestación y mejora del servicio</strong>: análisis interno para mejorar nuestros
              procesos, la experiencia de usuario y la calidad de las comunicaciones.
            </li>
            <li>
              <strong>Seguridad y prevención de fraude</strong>: prevenir envíos automatizados, abuso y
              usos no autorizados (por ejemplo, mecanismos anti-spam).
            </li>
            <li>
              <strong>Medición y analítica</strong>: comprender el uso del sitio y su rendimiento
              (cuando aplique y según configuración de cookies).
            </li>
          </ul>

          <h2>4. Base legal</h2>
          <p>
            La base legal para el tratamiento de tus datos dependerá del contexto:
          </p>
          <ul>
            <li>
              <strong>Consentimiento</strong>: cuando envías voluntariamente tus datos mediante un
              formulario o aceptas determinadas cookies.
            </li>
            <li>
              <strong>Interés legítimo</strong>: para garantizar la seguridad del sitio, prevenir fraude,
              mejorar nuestros servicios y mantener la continuidad del negocio.
            </li>
            <li>
              <strong>Ejecución de medidas precontractuales</strong>: para atender solicitudes relacionadas
              con nuestros servicios antes de una posible contratación.
            </li>
          </ul>

          <h2>5. Conservación de los datos</h2>
          <p>
            Conservaremos tus datos durante el tiempo necesario para cumplir con la finalidad para la que
            fueron recopilados y, posteriormente, durante los plazos exigidos por obligaciones legales o
            para la formulación, ejercicio o defensa de reclamaciones.
          </p>

          <h2>6. Cesiones y terceros</h2>
          <p>
            <strong>No vendemos tus datos</strong> ni los compartimos con terceros con fines comerciales.
            Tus datos se utilizan <strong>exclusivamente para tratamientos internos</strong> relacionados con
            la gestión de tu solicitud y la mejora del servicio.
          </p>
          <p>
            No obstante, para poder operar la web y gestionar comunicaciones, podemos apoyarnos en
            proveedores que actúan como encargados del tratamiento (por ejemplo, hosting, analítica,
            automatización o mensajería). Estos proveedores solo accederán a los datos para prestar el
            servicio contratado y bajo nuestras instrucciones.
          </p>

          <h2>7. Transferencias internacionales</h2>
          <p>
            Dependiendo de los proveedores utilizados, es posible que algunos datos se traten o alojen en
            países distintos al tuyo. En esos casos, adoptaremos medidas razonables para garantizar un
            nivel adecuado de protección conforme a la normativa aplicable.
          </p>

          <h2>8. Seguridad</h2>
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger tus datos frente a accesos
            no autorizados, alteración, divulgación o destrucción. Aun así, ningún sistema es 100% seguro,
            por lo que no podemos garantizar la seguridad absoluta.
          </p>

          <h2>9. Derechos de las personas usuarias</h2>
          <p>
            Puedes solicitar, según corresponda, el acceso, rectificación, supresión, oposición,
            limitación del tratamiento y portabilidad de tus datos. Para ejercer estos derechos, puedes
            escribirnos y atenderemos tu solicitud en los plazos legalmente establecidos.
          </p>

          <h2>10. Cookies y tecnologías similares</h2>
          <p>
            Podemos utilizar cookies y tecnologías similares para el funcionamiento del sitio, analítica y
            medición. Puedes obtener más información y gestionar tus preferencias desde el aviso de cookies
            mostrado en la web.
          </p>

          <h2>11. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad para reflejar cambios en nuestras prácticas o
            por motivos legales. Publicaremos la versión actualizada en esta página indicando la fecha de
            última actualización.
          </p>

          <h2>12. Contacto</h2>
          <p>
            Para cualquier consulta sobre esta Política de Privacidad o sobre el tratamiento de datos,
            puedes contactarnos en:{' '}
            <a href="mailto:contacto@libertyupgrowth.es">contacto@libertyupgrowth.es</a>
          </p>

          <p>
            <Link href="/">Volver a la página principal</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
