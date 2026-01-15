import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 })
    }

    // Validar tamaño (max 10MB antes de comprimir)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo es demasiado grande (máx. 10MB)' }, { status: 400 })
    }

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    // Comprimir y optimizar imagen con sharp
    let processedBuffer: Buffer
    let outputFormat: string
    let contentType: string

    try {
      const image = sharp(inputBuffer)
      const metadata = await image.metadata()

      // Redimensionar si es muy grande (máx 1920px de ancho, mantiene aspect ratio)
      const maxWidth = 1920
      let resizedImage = image
      
      if (metadata.width && metadata.width > maxWidth) {
        resizedImage = image.resize(maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
      }

      // Convertir a WebP para mejor compresión (excepto GIFs animados)
      if (file.type === 'image/gif' && metadata.pages && metadata.pages > 1) {
        // Mantener GIF animado sin convertir (solo redimensionar si es necesario)
        processedBuffer = await resizedImage.gif().toBuffer()
        outputFormat = 'gif'
        contentType = 'image/gif'
      } else if (file.type === 'image/gif') {
        // GIF estático: convertir a WebP
        processedBuffer = await resizedImage
          .webp({ 
            quality: 85,
            effort: 6,
          })
          .toBuffer()
        outputFormat = 'webp'
        contentType = 'image/webp'
      } else {
        // Convertir a WebP para mejor compresión
        processedBuffer = await resizedImage
          .webp({ 
            quality: 85, // Calidad alta pero comprimida
            effort: 6, // Nivel de compresión (0-6, 6 = mejor compresión)
          })
          .toBuffer()
        outputFormat = 'webp'
        contentType = 'image/webp'
      }
    } catch (sharpError) {
      console.error('Error procesando imagen con sharp:', sharpError)
      // Si falla sharp, usar imagen original
      processedBuffer = inputBuffer
      outputFormat = file.name.split('.').pop() || 'jpg'
      contentType = file.type
    }

    // Generar nombre único con extensión correcta
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${outputFormat}`
    const filePath = `blog/${fileName}`

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, processedBuffer, {
        contentType,
        upsert: false,
      })

    if (error) {
      console.error('Error uploading file:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from('blog-images').getPublicUrl(filePath)

    return NextResponse.json({ 
      url: publicUrl, 
      path: filePath,
      originalSize: file.size,
      compressedSize: processedBuffer.length,
      compressionRatio: ((1 - processedBuffer.length / file.size) * 100).toFixed(1)
    })
  } catch (error: any) {
    console.error('Error en upload-image:', error)
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 })
  }
}









