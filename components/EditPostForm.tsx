'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostEditor from '@/components/PostEditor'
import { updatePost, deletePost } from '@/app/actions/posts'
import { Post } from '@/types/database'
import Link from 'next/link'

interface EditPostFormProps {
  post: Post
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    content: post.content,
    featured_image: post.featured_image || '',
    status: post.status,
    published_at: post.published_at 
      ? new Date(post.published_at).toISOString().slice(0, 16)
      : '',
    seo_title: post.seo_title || '',
    seo_description: post.seo_description || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const postData = {
        ...formData,
        published_at: formData.status === 'scheduled' && formData.published_at 
          ? new Date(formData.published_at).toISOString() 
          : formData.status === 'published' && !post.published_at
          ? new Date().toISOString() 
          : formData.status === 'published' && post.published_at
          ? post.published_at
          : null,
        featured_image: formData.featured_image || null,
        seo_title: formData.seo_title || formData.title,
        seo_description: formData.seo_description || '',
      }

      const result = await updatePost(post.id, postData)

      if (result.error) {
        setError(result.error)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el post')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')

    try {
      const result = await deletePost(post.id)

      if (result.error) {
        setError(result.error)
        setDeleting(false)
        setShowDeleteConfirm(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el post')
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="admin-dashboard min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0a0a] to-[#080808] text-white">
      {/* Header Premium */}
      <header className="admin-header border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-white/[0.01] backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="admin-back-button"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                  Editar Post
                </h1>
                <p className="text-sm text-gray-500 font-medium truncate max-w-md">{post.title}</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="admin-danger-button"
            >
              <i className="fa-solid fa-trash mr-2"></i>
              Eliminar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} className="admin-form space-y-8">
          {error && (
            <div className="admin-error-alert">
              <i className="fa-solid fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          {/* Título */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              <i className="fa-solid fa-heading mr-2 text-[#FF6600]"></i>
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="admin-form-input"
            />
          </div>

          {/* Slug */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              <i className="fa-solid fa-link mr-2 text-[#FF6600]"></i>
              Slug (URL) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="admin-form-input admin-form-input-mono"
            />
            <p className="admin-form-hint">
              <i className="fa-solid fa-globe mr-1.5"></i>
              URL: <span className="text-[#FF6600]">/blog/{formData.slug}</span>
            </p>
          </div>

          {/* Imagen Destacada */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              <i className="fa-solid fa-image mr-2 text-[#FF6600]"></i>
              Imagen Destacada (URL)
            </label>
            <input
              type="url"
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              className="admin-form-input"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Estado y Fecha de Publicación */}
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">
                <i className="fa-solid fa-toggle-on mr-2 text-[#FF6600]"></i>
                Estado *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="admin-form-input"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="scheduled">Programado</option>
              </select>
            </div>

            {formData.status === 'scheduled' && (
              <div className="admin-form-group">
                <label className="admin-form-label">
                  <i className="fa-solid fa-calendar-alt mr-2 text-[#FF6600]"></i>
                  Fecha de Publicación
                </label>
                <input
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  className="admin-form-input"
                />
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="admin-form-section">
            <div className="admin-section-header">
              <i className="fa-solid fa-search mr-2 text-[#FF6600]"></i>
              <h3 className="admin-section-title">Optimización SEO</h3>
            </div>
            <div className="space-y-6 mt-6">
              <div className="admin-form-group">
                <label className="admin-form-label">Título SEO</label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Descripción SEO</label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  rows={3}
                  className="admin-form-input"
                />
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="admin-form-section">
            <div className="admin-section-header mb-4">
              <i className="fa-solid fa-pen-nib mr-2 text-[#FF6600]"></i>
              <h3 className="admin-section-title">Contenido *</h3>
            </div>
            <PostEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          {/* Actions */}
          <div className="admin-form-actions">
            <Link
              href="/admin"
              className="admin-secondary-button"
            >
              <i className="fa-solid fa-times mr-2"></i>
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="admin-primary-button"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check mr-2"></i>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-icon admin-modal-icon-danger">
                <i className="fa-solid fa-exclamation-triangle"></i>
              </div>
              <h3 className="admin-modal-title">¿Eliminar este post?</h3>
            </div>
            <p className="admin-modal-text">
              Esta acción no se puede deshacer. El post será eliminado permanentemente.
            </p>
            <div className="admin-modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="admin-secondary-button"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="admin-danger-button"
              >
                {deleting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash mr-2"></i>
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

