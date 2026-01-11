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

interface FloatingToolbarPosition {
  x: number
  y: number
}

export default function PostEditor({ content, onChange }: PostEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [floatingToolbar, setFloatingToolbar] = useState<FloatingToolbarPosition | null>(null)
  const floatingToolbarRef = useRef<HTMLDivElement>(null)
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

  // Detectar selección y mostrar toolbar flotante
  useEffect(() => {
    if (!editor) return

    const updateToolbarPosition = () => {
      try {
        const { from, to } = editor.state.selection
        
        if (from === to) {
          // No hay selección, ocultar toolbar
          setFloatingToolbar(null)
          return
        }

        // Usar doble requestAnimationFrame para asegurar que el DOM y el toolbar estén renderizados
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try {
              const { view } = editor
              
              // Obtener coordenadas usando la API de selección del navegador (más preciso)
              const selection = window.getSelection()
              let selectionRect: DOMRect | null = null
              
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)
                // Verificar que el range esté dentro del editor
                const editorElement = view.dom
                if (editorElement.contains(range.commonAncestorContainer)) {
                  selectionRect = range.getBoundingClientRect()
                }
              }
              
              // Si no hay selección válida del navegador, usar coordsAtPos de TipTap
              let selectionCenterX = 0
              let selectionTop = 0
              let selectionBottom = 0
              
              if (selectionRect && selectionRect.width > 0 && selectionRect.height > 0) {
                // Usar las coordenadas de la selección del navegador (ya están en viewport)
                selectionCenterX = selectionRect.left + selectionRect.width / 2
                selectionTop = selectionRect.top
                selectionBottom = selectionRect.bottom
              } else {
                // Fallback: usar coordsAtPos de TipTap
                const start = view.coordsAtPos(from)
                const end = view.coordsAtPos(to)
                selectionCenterX = (start.left + end.left) / 2
                selectionTop = start.top
                selectionBottom = end.bottom
              }
              
              // Obtener el ancho real del toolbar después de renderizarse
              const toolbarElement = floatingToolbarRef.current
              const toolbarWidth = toolbarElement?.offsetWidth || 380
              const toolbarHeight = toolbarElement?.offsetHeight || 50
              
              // Calcular posición centrada horizontalmente sobre la selección
              let x = selectionCenterX
              
              // Posición vertical: intentar arriba primero
              let y = selectionTop - toolbarHeight - 12

              // Ajustar horizontalmente si se sale de la pantalla
              const padding = 16
              const halfToolbarWidth = toolbarWidth / 2
              const viewportWidth = window.innerWidth
              const viewportHeight = window.innerHeight
              
              // Asegurar que el toolbar no se salga por los lados
              if (x - halfToolbarWidth < padding) {
                x = padding + halfToolbarWidth
              } else if (x + halfToolbarWidth > viewportWidth - padding) {
                x = viewportWidth - padding - halfToolbarWidth
              }

              // Ajustar verticalmente si se sale de la pantalla
              if (y < padding) {
                // Si no cabe arriba, ponerlo abajo de la selección
                y = selectionBottom + 12
              }
              
              // Verificar que no se salga por abajo
              if (y + toolbarHeight > viewportHeight - padding) {
                // Si tampoco cabe abajo, ponerlo arriba aunque se salga un poco
                y = Math.max(padding, selectionTop - toolbarHeight - 12)
              }

              // Asegurar que las coordenadas sean válidas
              x = Math.max(padding + halfToolbarWidth, Math.min(x, viewportWidth - padding - halfToolbarWidth))
              y = Math.max(padding, Math.min(y, viewportHeight - toolbarHeight - padding))

              setFloatingToolbar({ x, y })
            } catch (error) {
              console.error('Error calculating toolbar position:', error)
              setFloatingToolbar(null)
            }
          })
        })
      } catch (error) {
        // Si hay error, ocultar toolbar
        setFloatingToolbar(null)
      }
    }

    // Escuchar eventos del DOM directamente
    const editorElement = editor.view.dom
    
    const handleMouseUp = (e: MouseEvent) => {
      // Pequeño delay para que la selección se actualice
      setTimeout(() => {
        updateToolbarPosition()
      }, 10)
    }
    
    const handleKeyUp = () => {
      setTimeout(() => {
        updateToolbarPosition()
      }, 10)
    }

    const handleMouseMove = () => {
      // Solo actualizar si hay una selección activa (arrastrando)
      if (window.getSelection()?.toString().length) {
        setTimeout(() => {
          updateToolbarPosition()
        }, 10)
      }
    }

    // Escuchar eventos de selección
    editorElement.addEventListener('mouseup', handleMouseUp)
    editorElement.addEventListener('keyup', handleKeyUp)
    editorElement.addEventListener('mousemove', handleMouseMove)
    
    // Actualizar posición cuando cambia el tamaño de la ventana o se hace scroll
    const handleResize = () => {
      const { from, to } = editor.state.selection
      if (from !== to) {
        updateToolbarPosition()
      }
    }
    
    const handleScroll = () => {
      const { from, to } = editor.state.selection
      if (from !== to) {
        updateToolbarPosition()
      }
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true) // true para capturar scroll en todos los elementos
    
    // También usar un intervalo para verificar la selección periódicamente
    const intervalId = setInterval(() => {
      const { from, to } = editor.state.selection
      if (from !== to) {
        updateToolbarPosition()
      }
    }, 100)

    return () => {
      editorElement.removeEventListener('mouseup', handleMouseUp)
      editorElement.removeEventListener('keyup', handleKeyUp)
      editorElement.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll, true)
      clearInterval(intervalId)
    }
  }, [editor])

  // Ocultar toolbar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (floatingToolbarRef.current && !floatingToolbarRef.current.contains(e.target as Node)) {
        // Solo ocultar si no hay selección
        if (editor) {
          const { from, to } = editor.state.selection
          if (from === to) {
            setFloatingToolbar(null)
          }
        }
      }
    }

    if (floatingToolbar) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [floatingToolbar, editor])

  if (!editor) {
    return <div className="text-gray-400">Cargando editor...</div>
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

      {/* Toolbar Flotante */}
      {floatingToolbar && (
        <div
          ref={floatingToolbarRef}
          className="admin-floating-toolbar"
          style={{
            position: 'fixed',
            left: `${floatingToolbar.x}px`,
            top: `${floatingToolbar.y}px`,
            zIndex: 1000,
            transform: 'translateX(-50%)',
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="admin-floating-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`admin-floating-toolbar-button ${editor.isActive('bold') ? 'active' : ''}`}
              title="Negrita (Ctrl+B)"
            >
              <i className="fa-solid fa-bold"></i>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`admin-floating-toolbar-button ${editor.isActive('italic') ? 'active' : ''}`}
              title="Cursiva (Ctrl+I)"
            >
              <i className="fa-solid fa-italic"></i>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`admin-floating-toolbar-button ${editor.isActive('strike') ? 'active' : ''}`}
              title="Tachado"
            >
              <i className="fa-solid fa-strikethrough"></i>
            </button>
          </div>

          <div className="admin-floating-toolbar-divider"></div>

          <div className="admin-floating-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`admin-floating-toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
              title="Título 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`admin-floating-toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
              title="Título 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`admin-floating-toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
              title="Título 3"
            >
              H3
            </button>
          </div>

          <div className="admin-floating-toolbar-divider"></div>

          <div className="admin-floating-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`admin-floating-toolbar-button ${editor.isActive('bulletList') ? 'active' : ''}`}
              title="Lista con viñetas"
            >
              <i className="fa-solid fa-list-ul"></i>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`admin-floating-toolbar-button ${editor.isActive('orderedList') ? 'active' : ''}`}
              title="Lista numerada"
            >
              <i className="fa-solid fa-list-ol"></i>
            </button>
          </div>

          <div className="admin-floating-toolbar-divider"></div>

          <div className="admin-floating-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`admin-floating-toolbar-button ${editor.isActive('blockquote') ? 'active' : ''}`}
              title="Cita"
            >
              <i className="fa-solid fa-quote-left"></i>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`admin-floating-toolbar-button ${editor.isActive('code') ? 'active' : ''}`}
              title="Código"
            >
              <i className="fa-solid fa-code"></i>
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('Introduce la URL:')
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run()
                }
              }}
              className={`admin-floating-toolbar-button ${editor.isActive('link') ? 'active' : ''}`}
              title="Enlace"
            >
              <i className="fa-solid fa-link"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


