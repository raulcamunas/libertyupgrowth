'use client'

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label = 'Imagen Destacada' }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Actualizar preview cuando cambia el value
  useEffect(() => {
    if (value) {
      setPreview(value)
    } else {
      setPreview(null)
    }
  }, [value])

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = async (file: File) => {
    setError('')

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setError('Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, WebP, GIF)')
      return
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 5MB')
      return
    }

    // Crear preview local
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Subir archivo
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setPreview(null)
        return
      }

      if (data.url) {
        onChange(data.url)
        setPreview(data.url)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Error al subir la imagen. Intenta de nuevo.')
      setPreview(null)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange('')
    setPreview(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="admin-form-group">
      <label className="admin-form-label">
        <i className="fa-solid fa-image mr-2 text-[#FF6600]"></i>
        {label}
      </label>

      <div
        className={`image-upload-area ${isDragging ? 'dragging' : ''} ${preview ? 'has-image' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="upload-loading">
            <i className="fa-solid fa-spinner fa-spin text-[#FF6600] text-2xl mb-2"></i>
            <p className="text-sm text-gray-400">Subiendo imagen...</p>
          </div>
        ) : preview ? (
          <div className="upload-preview">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="remove-button"
                title="Eliminar imagen"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
                className="change-button"
                title="Cambiar imagen"
              >
                <i className="fa-solid fa-pencil"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-500 mb-3"></i>
            <p className="text-gray-400 mb-1">
              <span className="text-[#FF6600] font-semibold">Haz clic</span> o arrastra una imagen aquí
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WebP o GIF (máx. 5MB)</p>
          </div>
        )}
      </div>

      {error && (
        <p className="admin-form-error mt-2">
          <i className="fa-solid fa-exclamation-circle mr-1.5"></i>
          {error}
        </p>
      )}

      {value && !preview && (
        <p className="admin-form-hint mt-2">
          <i className="fa-solid fa-info-circle mr-1.5"></i>
          URL actual: <span className="text-[#FF6600] break-all">{value}</span>
        </p>
      )}
    </div>
  )
}

