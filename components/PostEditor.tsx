'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useState, useEffect, useRef } from 'react'
import React from 'react'

interface PostEditorProps {
  content: string
  onChange: (content: string) => void
}

interface ContextMenuPosition {
  x: number
  y: number
}

export default function PostEditor({ content, onChange }: PostEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null,
              parseHTML: element => {
                const width = element.getAttribute('width')
                const style = element.getAttribute('style')
                if (width) return width.replace('px', '')
                if (style) {
                  const match = style.match(/width:\s*(\d+)px/)
                  return match ? match[1] : null
                }
                return null
              },
              renderHTML: attributes => {
                if (!attributes.width) {
                  return {}
                }
                return {
                  width: attributes.width + 'px',
                }
              },
            },
            height: {
              default: null,
              parseHTML: element => {
                const height = element.getAttribute('height')
                const style = element.getAttribute('style')
                if (height) return height.replace('px', '')
                if (style) {
                  const match = style.match(/height:\s*(\d+)px/)
                  return match ? match[1] : null
                }
                return null
              },
              renderHTML: attributes => {
                if (!attributes.height) {
                  return {}
                }
                return {
                  height: attributes.height + 'px',
                }
              },
            },
            style: {
              default: null,
              parseHTML: element => element.getAttribute('style'),
              renderHTML: attributes => {
                if (!attributes.style) {
                  return {}
                }
                return {
                  style: attributes.style,
                }
              },
            },
          }
        },
        addNodeView() {
          return ({ node, HTMLAttributes, getPos, editor }) => {
            const container = document.createElement('span')
            container.className = 'image-resize-container'
            container.style.display = 'inline-block'
            container.style.position = 'relative'
            container.style.cursor = 'pointer'

            const img = document.createElement('img')
            img.src = node.attrs.src
            img.alt = node.attrs.alt || ''
            img.style.maxWidth = '100%'
            img.style.height = 'auto'
            img.style.display = 'block'
            
            if (node.attrs.width) {
              img.style.width = node.attrs.width + 'px'
            }
            if (node.attrs.height) {
              img.style.height = node.attrs.height + 'px'
            }
            if (node.attrs.style) {
              Object.assign(img.style, node.attrs.style.split(';').reduce((acc: any, rule: string) => {
                const [key, value] = rule.split(':').map(s => s.trim())
                if (key && value) {
                  acc[key] = value
                }
                return acc
              }, {}))
            }

            let isResizing = false
            let startX = 0
            let startY = 0
            let startWidth = 0
            let startHeight = 0
            let aspectRatio = 1

            const updateImageSize = (width: number, height: number) => {
              const pos = getPos()
              if (typeof pos === 'number') {
                const attrs: any = {
                  width: Math.round(width) + 'px',
                  height: Math.round(height) + 'px',
                  style: `width: ${Math.round(width)}px; height: ${Math.round(height)}px; max-width: 100%;`,
                }
                editor.commands.updateAttributes('image', attrs)
              }
            }

            const createResizeHandle = (position: string) => {
              const handle = document.createElement('div')
              handle.className = `resize-handle resize-handle-${position}`
              handle.style.position = 'absolute'
              handle.style.width = '12px'
              handle.style.height = '12px'
              handle.style.backgroundColor = '#FF6600'
              handle.style.border = '2px solid white'
              handle.style.borderRadius = '50%'
              handle.style.cursor = position === 'nw' ? 'nw-resize' :
                                     position === 'ne' ? 'ne-resize' :
                                     position === 'sw' ? 'sw-resize' :
                                     position === 'se' ? 'se-resize' : 'move'
              handle.style.zIndex = '10'
              handle.style.opacity = '0'
              handle.style.transition = 'opacity 0.2s'

              if (position.includes('n')) handle.style.top = '-6px'
              if (position.includes('s')) handle.style.bottom = '-6px'
              if (position.includes('e')) handle.style.right = '-6px'
              if (position.includes('w')) handle.style.left = '-6px'

              handle.addEventListener('mousedown', (e) => {
                e.preventDefault()
                e.stopPropagation()
                isResizing = true
                startX = e.clientX
                startY = e.clientY
                startWidth = img.offsetWidth
                startHeight = img.offsetHeight
                aspectRatio = startWidth / startHeight

                const onMouseMove = (e: MouseEvent) => {
                  if (!isResizing) return
                  
                  const deltaX = e.clientX - startX
                  const deltaY = e.clientY - startY
                  
                  let newWidth = startWidth
                  let newHeight = startHeight

                  if (position.includes('e')) {
                    newWidth = startWidth + deltaX
                  }
                  if (position.includes('w')) {
                    newWidth = startWidth - deltaX
                  }
                  if (position.includes('s')) {
                    newHeight = startHeight + deltaY
                  }
                  if (position.includes('n')) {
                    newHeight = startHeight - deltaY
                  }

                  // Mantener aspect ratio si se presiona Shift
                  if (e.shiftKey) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                      newHeight = newWidth / aspectRatio
                    } else {
                      newWidth = newHeight * aspectRatio
                    }
                  }

                  // Límites mínimos
                  newWidth = Math.max(50, newWidth)
                  newHeight = Math.max(50, newHeight)

                  img.style.width = newWidth + 'px'
                  img.style.height = newHeight + 'px'
                }

                const onMouseUp = () => {
                  if (isResizing) {
                    updateImageSize(img.offsetWidth, img.offsetHeight)
                    isResizing = false
                  }
                  document.removeEventListener('mousemove', onMouseMove)
                  document.removeEventListener('mouseup', onMouseUp)
                }

                document.addEventListener('mousemove', onMouseMove)
                document.addEventListener('mouseup', onMouseUp)
              })

              return handle
            }

            container.appendChild(img)
            
            // Mostrar handles al hacer hover
            container.addEventListener('mouseenter', () => {
              const handles = container.querySelectorAll('.resize-handle')
              handles.forEach((handle: any) => {
                handle.style.opacity = '1'
              })
            })

            container.addEventListener('mouseleave', () => {
              if (!isResizing) {
                const handles = container.querySelectorAll('.resize-handle')
                handles.forEach((handle: any) => {
                  handle.style.opacity = '0'
                })
              }
            })

            // Crear handles en las 4 esquinas
            container.appendChild(createResizeHandle('nw'))
            container.appendChild(createResizeHandle('ne'))
            container.appendChild(createResizeHandle('sw'))
            container.appendChild(createResizeHandle('se'))

            return {
              dom: container,
            }
          }
        },
      }).configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#FF6600] underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-6',
      },
    },
  })

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

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
        alert(`Error: ${data.error}`)
        return
      }

      // Insertar imagen en el editor
      if (editor && data.url) {
        editor.chain().focus().setImage({ src: data.url }).run()
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
      // Reset input
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  // Manejar menú contextual
  useEffect(() => {
    if (!editor) return

    const handleContextMenu = (e: MouseEvent) => {
      // Solo mostrar si hay texto seleccionado
      const { from, to } = editor.state.selection
      if (from === to) {
        return // No hay selección
      }

      e.preventDefault()
      
      // Calcular posición ajustada para evitar que se salga de la pantalla
      const menuWidth = 240
      const menuHeight = 400 // Aproximado
      let x = e.clientX
      let y = e.clientY
      
      // Ajustar horizontalmente
      if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10
      }
      if (x < 10) {
        x = 10
      }
      
      // Ajustar verticalmente
      if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 10
      }
      if (y < 10) {
        y = 10
      }
      
      setContextMenu({ x, y })
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }

    const editorElement = editor.view.dom
    editorElement.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClickOutside)

    return () => {
      editorElement.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [editor])

  // Cerrar menú con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null)
      }
    }

    if (contextMenu) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [contextMenu])

  if (!editor) {
    return <div className="text-gray-400">Cargando editor...</div>
  }

  const handleContextMenuAction = (action: () => void) => {
    action()
    setContextMenu(null)
    editor.chain().focus().run()
  }

  return (
    <div className="admin-editor-container" ref={editorRef}>
      {/* Toolbar */}
      <div className="admin-editor-toolbar">
        {/* Text Formatting */}
        <div className="admin-toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`admin-toolbar-button ${editor.isActive('bold') ? 'active' : ''}`}
            title="Negrita (Ctrl+B)"
          >
            <i className="fa-solid fa-bold"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`admin-toolbar-button ${editor.isActive('italic') ? 'active' : ''}`}
            title="Cursiva (Ctrl+I)"
          >
            <i className="fa-solid fa-italic"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`admin-toolbar-button ${editor.isActive('strike') ? 'active' : ''}`}
            title="Tachado"
          >
            <i className="fa-solid fa-strikethrough"></i>
          </button>
        </div>

        {/* Headings */}
        <div className="admin-toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`admin-toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
            title="Título 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`admin-toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
            title="Título 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`admin-toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
            title="Título 3"
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="admin-toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`admin-toolbar-button ${editor.isActive('bulletList') ? 'active' : ''}`}
            title="Lista con viñetas"
          >
            <i className="fa-solid fa-list-ul"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`admin-toolbar-button ${editor.isActive('orderedList') ? 'active' : ''}`}
            title="Lista numerada"
          >
            <i className="fa-solid fa-list-ol"></i>
          </button>
        </div>

        {/* Blockquote */}
        <div className="admin-toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`admin-toolbar-button ${editor.isActive('blockquote') ? 'active' : ''}`}
            title="Cita"
          >
            <i className="fa-solid fa-quote-left"></i>
          </button>
        </div>

        {/* Code */}
        <div className="admin-toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`admin-toolbar-button ${editor.isActive('code') ? 'active' : ''}`}
            title="Código"
          >
            <i className="fa-solid fa-code"></i>
          </button>
        </div>

        {/* Link */}
        <div className="admin-toolbar-group">
          <button
            type="button"
            onClick={() => {
              const url = window.prompt('Introduce la URL:')
              if (url) {
                editor.chain().focus().setLink({ href: url }).run()
              }
            }}
            className={`admin-toolbar-button ${editor.isActive('link') ? 'active' : ''}`}
            title="Enlace"
          >
            <i className="fa-solid fa-link"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="admin-toolbar-button"
            title="Quitar enlace"
            disabled={!editor.isActive('link')}
          >
            <i className="fa-solid fa-unlink"></i>
          </button>
        </div>

        {/* Image Upload */}
        <div className="admin-toolbar-group">
          <label
            className={`admin-toolbar-button ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Subir imagen"
          >
            <i className="fa-solid fa-image"></i>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Editor Content */}
      <div className="admin-editor-content">
        <EditorContent editor={editor} />
      </div>

      {/* Menú Contextual */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="admin-context-menu"
          style={{
            position: 'fixed',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            zIndex: 1000,
          }}
        >
          <div className="admin-context-menu-section">
            <div className="admin-context-menu-label">Formato de texto</div>
            <button
              type="button"
              onClick={() => handleContextMenuAction(() => editor.chain().focus().toggleBold().run())}
              className={`admin-context-menu-item ${editor.isActive('bold') ? 'active' : ''}`}
            >
              <i className="fa-solid fa-bold"></i>
              <span>Negrita</span>
              <span className="admin-context-menu-shortcut">Ctrl+B</span>
            </button>
            <button
              type="button"
              onClick={() => handleContextMenuAction(() => editor.chain().focus().toggleItalic().run())}
              className={`admin-context-menu-item ${editor.isActive('italic') ? 'active' : ''}`}
            >
              <i className="fa-solid fa-italic"></i>
              <span>Cursiva</span>
              <span className="admin-context-menu-shortcut">Ctrl+I</span>
            </button>
            <button
              type="button"
              onClick={() => handleContextMenuAction(() => editor.chain().focus().toggleStrike().run())}
              className={`admin-context-menu-item ${editor.isActive('strike') ? 'active' : ''}`}
            >
              <i className="fa-solid fa-strikethrough"></i>
              <span>Tachado</span>
            </button>
          </div>

          <div className="admin-context-menu-divider"></div>

          <div className="admin-context-menu-section">
            <div className="admin-context-menu-label">Encabezados</div>
            <button
              type="button"
              onClick={() => handleContextMenuAction(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
              className={`admin-context-menu-item ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
            >
              <span className="admin-context-menu-heading">H1</span>
              <span>Título 1</span>
            </button>
            <button
              type="button"
              onClick={() => handleContextMenuAction(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
              className={`admin-context-menu-item ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
            >
              <span className="admin-context-menu-heading">H2</span>
              <span>Título 2</span>
            </button>
            <button
              type="button"
              onClick={() => handleContextMenuAction(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
              className={`admin-context-menu-item ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
            >
              <span className="admin-context-menu-heading">H3</span>
              <span>Título 3</span>
            </button>
          </div>

          <div className="admin-context-menu-divider"></div>

          <div className="admin-context-menu-section">
            <div className="admin-context-menu-label">Listas</div>
            <button
              type="button"
              onClick={() => handleContextMenuAction(() => editor.chain().focus().toggleBulletList().run())}
              className={`admin-context-menu-item ${editor.isActive('bulletList') ? 'active' : ''}`}
            >
              <i className="fa-solid fa-list-ul"></i>
              <span>Lista con viñetas</span>
            </button>
            <button
              type="button"
              onClick={() => handleContextMenuAction(() => editor.chain().focus().toggleOrderedList().run())}
              className={`admin-context-menu-item ${editor.isActive('orderedList') ? 'active' : ''}`}
            >
              <i className="fa-solid fa-list-ol"></i>
              <span>Lista numerada</span>
            </button>
          </div>

          <div className="admin-context-menu-divider"></div>

          <div className="admin-context-menu-section">
            <button
              type="button"
              onClick={() => handleContextMenuAction(() => editor.chain().focus().toggleBlockquote().run())}
              className={`admin-context-menu-item ${editor.isActive('blockquote') ? 'active' : ''}`}
            >
              <i className="fa-solid fa-quote-left"></i>
              <span>Cita</span>
            </button>
            <button
              type="button"
              onClick={() => handleContextMenuAction(() => editor.chain().focus().toggleCode().run())}
              className={`admin-context-menu-item ${editor.isActive('code') ? 'active' : ''}`}
            >
              <i className="fa-solid fa-code"></i>
              <span>Código</span>
            </button>
          </div>

          <div className="admin-context-menu-divider"></div>

          <div className="admin-context-menu-section">
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('Introduce la URL:')
                if (url) {
                  handleContextMenuAction(() => editor.chain().focus().setLink({ href: url }).run())
                } else {
                  setContextMenu(null)
                }
              }}
              className={`admin-context-menu-item ${editor.isActive('link') ? 'active' : ''}`}
            >
              <i className="fa-solid fa-link"></i>
              <span>Enlace</span>
            </button>
            {editor.isActive('link') && (
              <button
                type="button"
                onClick={() => handleContextMenuAction(() => editor.chain().focus().unsetLink().run())}
                className="admin-context-menu-item"
              >
                <i className="fa-solid fa-unlink"></i>
                <span>Quitar enlace</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


