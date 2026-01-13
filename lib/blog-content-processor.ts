/**
 * Procesa el contenido del blog y convierte etiquetas de formato a HTML
 * 
 * Etiquetas soportadas:
 * - [H1] texto [/H1] -> <h1>texto</h1>
 * - [H2] texto [/H2] -> <h2>texto</h2>
 * - [H3] texto [/H3] -> <h3>texto</h3>
 * - [H4] texto [/H4] -> <h4>texto</h4>
 * - [BOLD] texto [/BOLD] -> <strong>texto</strong>
 * - [B] texto [/B] -> <strong>texto</strong>
 * - [ITALIC] texto [/ITALIC] -> <em>texto</em>
 * - [I] texto [/I] -> <em>texto</em>
 * - [CITA] texto [/CITA] -> <blockquote>texto</blockquote>
 * - [QUOTE] texto [/QUOTE] -> <blockquote>texto</blockquote>
 * - [LISTA] item1|item2|item3 [/LISTA] -> <ul><li>item1</li><li>item2</li><li>item3</li></ul>
 * - [LISTA-NUM] item1|item2|item3 [/LISTA-NUM] -> <ol><li>item1</li><li>item2</li><li>item3</li></ol>
 * - [LINK] texto|url [/LINK] -> <a href="url">texto</a>
 * - [CODE] código [/CODE] -> <code>código</code>
 * - [BR] -> <br />
 * - [HR] -> <hr />
 */

export function processBlogContent(content: string): string {
  if (!content) return ''

  let processed = content

  // Procesar títulos H1, H2, H3, H4
  // Usamos [\s\S] en lugar de . para compatibilidad con versiones anteriores (sin flag 's')
  processed = processed.replace(/\[H1\]([\s\S]*?)\[\/H1\]/gi, '<h1>$1</h1>')
  processed = processed.replace(/\[H2\]([\s\S]*?)\[\/H2\]/gi, '<h2>$1</h2>')
  processed = processed.replace(/\[H3\]([\s\S]*?)\[\/H3\]/gi, '<h3>$1</h3>')
  processed = processed.replace(/\[H4\]([\s\S]*?)\[\/H4\]/gi, '<h4>$1</h4>')

  // Procesar negritas
  processed = processed.replace(/\[BOLD\]([\s\S]*?)\[\/BOLD\]/gi, '<strong>$1</strong>')
  processed = processed.replace(/\[B\]([\s\S]*?)\[\/B\]/gi, '<strong>$1</strong>')

  // Procesar cursivas
  processed = processed.replace(/\[ITALIC\]([\s\S]*?)\[\/ITALIC\]/gi, '<em>$1</em>')
  processed = processed.replace(/\[I\]([\s\S]*?)\[\/I\]/gi, '<em>$1</em>')

  // Procesar citas/blockquotes
  processed = processed.replace(/\[CITA\]([\s\S]*?)\[\/CITA\]/gi, '<blockquote>$1</blockquote>')
  processed = processed.replace(/\[QUOTE\]([\s\S]*?)\[\/QUOTE\]/gi, '<blockquote>$1</blockquote>')

  // Procesar listas no ordenadas
  processed = processed.replace(/\[LISTA\]([\s\S]*?)\[\/LISTA\]/gi, (match, items) => {
    const itemList = items.split('|').filter((item: string) => item.trim())
    const listItems = itemList.map((item: string) => `<li>${item.trim()}</li>`).join('')
    return `<ul>${listItems}</ul>`
  })

  // Procesar listas ordenadas
  processed = processed.replace(/\[LISTA-NUM\]([\s\S]*?)\[\/LISTA-NUM\]/gi, (match, items) => {
    const itemList = items.split('|').filter((item: string) => item.trim())
    const listItems = itemList.map((item: string) => `<li>${item.trim()}</li>`).join('')
    return `<ol>${listItems}</ol>`
  })

  // Procesar enlaces [LINK] texto|url [/LINK]
  processed = processed.replace(/\[LINK\]([\s\S]*?)\[\/LINK\]/gi, (match, content) => {
    const parts = content.split('|')
    if (parts.length === 2) {
      const text = parts[0].trim()
      const url = parts[1].trim()
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
    }
    return content
  })

  // Procesar código
  processed = processed.replace(/\[CODE\]([\s\S]*?)\[\/CODE\]/gi, '<code>$1</code>')

  // Procesar saltos de línea y líneas horizontales
  processed = processed.replace(/\[BR\]/gi, '<br />')
  processed = processed.replace(/\[HR\]/gi, '<hr />')

  // Convertir saltos de línea simples a <br> (opcional, para preservar formato)
  // processed = processed.replace(/\n\n/g, '</p><p>')
  // processed = processed.replace(/\n/g, '<br />')

  return processed
}

