/**
 * Script para crear un post de ejemplo en Supabase
 * Ejecutar con: node scripts/create-sample-post.js
 * 
 * Asegúrate de tener las variables de entorno configuradas en .env.local
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno. Asegúrate de tener:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createSamplePost() {
  console.log('🚀 Creando post de ejemplo...')

  // Primero necesitamos un usuario. Si no existe, crearemos uno de ejemplo
  // O puedes usar un usuario existente
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
  
  if (usersError || !users || users.length === 0) {
    console.error('❌ No hay usuarios en Supabase. Por favor crea un usuario primero desde el panel de administración.')
    console.error('   Ve a: Supabase Dashboard > Authentication > Users > Add User')
    return
  }

  const userId = users[0].id
  console.log(`✅ Usando usuario: ${users[0].email || userId}`)

  const samplePost = {
    title: 'Cómo Reducir tu ACOS en Amazon FBA: Guía Completa 2025',
    slug: 'como-reducir-acos-amazon-fba-guia-2025',
    content: `
      <h2>Introducción</h2>
      <p>El <strong>ACOS (Advertising Cost of Sales)</strong> es uno de los indicadores más importantes para medir la rentabilidad de tus campañas publicitarias en Amazon. Un ACOS alto significa que estás gastando demasiado en publicidad en relación con tus ventas, lo que puede hacer que tu negocio no sea rentable.</p>
      
      <blockquote>
        <p>El éxito en Amazon FBA no se mide solo por las ventas, sino por la rentabilidad real de cada euro invertido en publicidad.</p>
      </blockquote>
      
      <h2>¿Qué es el ACOS?</h2>
      <p>El ACOS se calcula dividiendo el gasto en publicidad entre las ventas generadas por esa publicidad, multiplicado por 100. Por ejemplo, si gastas <strong>100€ en publicidad</strong> y generas <strong>500€ en ventas</strong>, tu ACOS sería del <strong>20%</strong>.</p>
      
      <p>La fórmula es simple:</p>
      <p><strong>ACOS = (Gasto en Publicidad / Ventas) × 100</strong></p>
      
      <h2>Estrategias para Reducir el ACOS</h2>
      
      <h3>1. Optimización de Palabras Clave</h3>
      <p>Una de las formas más efectivas de reducir el ACOS es optimizar tus palabras clave. Elimina las palabras clave que no están generando conversiones y enfócate en aquellas que tienen un buen rendimiento.</p>
      
      <ul>
        <li><strong>Analiza el rendimiento</strong> de cada palabra clave semanalmente</li>
        <li><strong>Pausa palabras clave</strong> con ACOS superior al 30%</li>
        <li><strong>Aumenta el presupuesto</strong> en palabras clave con buen rendimiento</li>
        <li>Utiliza <strong>negativas exactas</strong> para evitar desperdiciar presupuesto</li>
      </ul>
      
      <blockquote>
        <p>La clave no está en gastar más, sino en gastar mejor. Una palabra clave bien optimizada puede generar el doble de conversiones con la mitad del presupuesto.</p>
      </blockquote>
      
      <h3>2. Mejora de la Tasa de Conversión</h3>
      <p>Un listing optimizado con <strong>buenas imágenes</strong>, <strong>descripción clara</strong> y <strong>reseñas positivas</strong> puede mejorar significativamente tu tasa de conversión, lo que a su vez reduce tu ACOS.</p>
      
      <p>Elementos clave para mejorar la conversión:</p>
      <ol>
        <li><strong>Imágenes de alta calidad</strong> que muestren el producto desde todos los ángulos</li>
        <li><strong>Bullet points optimizados</strong> con palabras clave relevantes</li>
        <li><strong>Reseñas auténticas</strong> que generen confianza</li>
        <li><strong>Precio competitivo</strong> pero rentable</li>
      </ol>
      
      <h3>3. Segmentación por Productos</h3>
      <p>No todos los productos tienen el mismo margen. Asegúrate de que tus campañas publicitarias se centren en productos con <strong>buenos márgenes de beneficio</strong>.</p>
      
      <h4>¿Cómo identificar productos rentables?</h4>
      <p>Un producto es rentable cuando su margen permite cubrir:</p>
      <ul>
        <li>Coste del producto</li>
        <li>Gastos de envío y almacenamiento</li>
        <li>Comisiones de Amazon</li>
        <li><strong>Gasto en publicidad (ACOS)</strong></li>
        <li>Y aún así deja un beneficio razonable</li>
      </ul>
      
      <h2>Conclusión</h2>
      <p>Reducir el ACOS requiere un <strong>enfoque sistemático y constante</strong>. En Liberty Seller, ayudamos a nuestros clientes a optimizar sus campañas publicitarias para maximizar la rentabilidad. Si necesitas ayuda, no dudes en contactarnos.</p>
      
      <blockquote>
        <p>La diferencia entre un vendedor exitoso y uno que lucha no está en el presupuesto, sino en la estrategia. Una gestión profesional puede reducir tu ACOS hasta un 40% mientras aumentas tus ventas.</p>
      </blockquote>
    `,
    featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop',
    author: 'Equipo Liberty Seller',
    status: 'published',
    published_at: new Date().toISOString(),
    seo_title: 'Cómo Reducir tu ACOS en Amazon FBA: Guía Completa 2025 | Liberty Seller',
    seo_description: 'Descubre las mejores estrategias para reducir tu ACOS en Amazon FBA y aumentar la rentabilidad de tus campañas publicitarias. Guía completa con ejemplos prácticos.',
    user_id: userId,
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([samplePost])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      console.log('ℹ️  El post ya existe. Actualizando...')
      const { data: updatedData, error: updateError } = await supabase
        .from('posts')
        .update(samplePost)
        .eq('slug', samplePost.slug)
        .select()
        .single()
      
      if (updateError) {
        console.error('❌ Error al actualizar el post:', updateError)
        return
      }
      
      console.log('✅ Post actualizado exitosamente!')
      console.log('📝 Título:', updatedData.title)
      console.log('🔗 Slug:', updatedData.slug)
      console.log('🌐 URL:', `http://localhost:3000/blog/${updatedData.slug}`)
    } else {
      console.error('❌ Error al crear el post:', error)
      return
    }
  } else {
    console.log('✅ Post creado exitosamente!')
    console.log('📝 Título:', data.title)
    console.log('🔗 Slug:', data.slug)
    console.log('🌐 URL:', `http://localhost:3000/blog/${data.slug}`)
  }
}

createSamplePost()
  .then(() => {
    console.log('✨ Proceso completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })

