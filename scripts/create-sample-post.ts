/**
 * Script para crear un post de ejemplo en Supabase
 * Ejecutar con: npx tsx scripts/create-sample-post.ts
 * 
 * Asegúrate de tener las variables de entorno configuradas en .env.local
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

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
    return
  }

  const userId = users[0].id

  const samplePost = {
    title: 'Cómo Reducir tu ACOS en Amazon FBA: Guía Completa 2025',
    slug: 'como-reducir-acos-amazon-fba-guia-2025',
    content: `
      <h2>Introducción</h2>
      <p>El ACOS (Advertising Cost of Sales) es uno de los indicadores más importantes para medir la rentabilidad de tus campañas publicitarias en Amazon. Un ACOS alto significa que estás gastando demasiado en publicidad en relación con tus ventas, lo que puede hacer que tu negocio no sea rentable.</p>
      
      <h2>¿Qué es el ACOS?</h2>
      <p>El ACOS se calcula dividiendo el gasto en publicidad entre las ventas generadas por esa publicidad, multiplicado por 100. Por ejemplo, si gastas 100€ en publicidad y generas 500€ en ventas, tu ACOS sería del 20%.</p>
      
      <h2>Estrategias para Reducir el ACOS</h2>
      
      <h3>1. Optimización de Palabras Clave</h3>
      <p>Una de las formas más efectivas de reducir el ACOS es optimizar tus palabras clave. Elimina las palabras clave que no están generando conversiones y enfócate en aquellas que tienen un buen rendimiento.</p>
      
      <h3>2. Mejora de la Tasa de Conversión</h3>
      <p>Un listing optimizado con buenas imágenes, descripción clara y reseñas positivas puede mejorar significativamente tu tasa de conversión, lo que a su vez reduce tu ACOS.</p>
      
      <h3>3. Segmentación por Productos</h3>
      <p>No todos los productos tienen el mismo margen. Asegúrate de que tus campañas publicitarias se centren en productos con buenos márgenes de beneficio.</p>
      
      <h2>Conclusión</h2>
      <p>Reducir el ACOS requiere un enfoque sistemático y constante. En Liberty Seller, ayudamos a nuestros clientes a optimizar sus campañas publicitarias para maximizar la rentabilidad. Si necesitas ayuda, no dudes en contactarnos.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop',
    author: 'Equipo Liberty Seller',
    status: 'published' as const,
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
    console.error('❌ Error al crear el post:', error)
    return
  }

  console.log('✅ Post creado exitosamente!')
  console.log('📝 Título:', data.title)
  console.log('🔗 Slug:', data.slug)
  console.log('🌐 URL:', `http://localhost:3000/blog/${data.slug}`)
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

