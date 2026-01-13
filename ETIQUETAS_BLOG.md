# PROMPT: Sistema de Etiquetas para Contenido de Blog

## INSTRUCCIONES PARA IA

Cuando generes contenido para el blog, DEBES usar estas etiquetas de formato en lugar de HTML directo. El sistema convertirá automáticamente estas etiquetas a HTML cuando se publique el contenido.

**IMPORTANTE:**
- Usa SIEMPRE las etiquetas de apertura y cierre (ej: `[H2]...[/H2]`)
- Las etiquetas son CASE-SENSITIVE (mayúsculas)
- No mezcles HTML directo con estas etiquetas
- Los elementos de listas se separan con el símbolo `|` (pipe)

---

## ETIQUETAS DISPONIBLES

### 1. TÍTULOS

**H1 - Título Principal (usar solo una vez por artículo)**
```
[H1] Título del artículo [/H1]
```

**H2 - Subtítulo Principal (usar para secciones principales)**
```
[H2] Nombre de la sección [/H2]
```

**H3 - Subtítulo Secundario (usar para subsecciones)**
```
[H3] Subtítulo dentro de una sección [/H3]
```

**H4 - Subtítulo Terciario (usar para sub-subsecciones)**
```
[H4] Subtítulo de nivel 4 [/H4]
```

**Ejemplo de uso:**
```
[H2] ¿Qué negativas uso: Exact o Phrase? [/H2]

Texto del párrafo aquí...

[H3] Explicación detallada [/H3]
```

---

### 2. FORMATO DE TEXTO

**Negritas (texto importante o destacado)**
```
[BOLD] Texto en negrita [/BOLD]
```
o versión corta:
```
[B] Texto en negrita [/B]
```

**Cursivas (énfasis o términos técnicos)**
```
[ITALIC] Texto en cursiva [/ITALIC]
```
o versión corta:
```
[I] Texto en cursiva [/I]
```

**Ejemplo de uso:**
```
Este es un párrafo normal con [BOLD] información importante [/BOLD] y [ITALIC] términos técnicos [/ITALIC].
```

---

### 3. CITAS Y DESTACADOS

**Cita/Blockquote (para citas, testimonios o información destacada)**
```
[CITA] Texto de la cita aquí [/CITA]
```
o alternativo:
```
[QUOTE] Texto de la cita aquí [/QUOTE]
```

**Ejemplo de uso:**
```
[CITA] Si alguien te garantiza ventas fijas en Amazon, huye. Nosotros somos honestos: el mercado fluctúa. [/CITA]
```

---

### 4. LISTAS

**Lista No Ordenada (con viñetas)**
```
[LISTA] Primer elemento|Segundo elemento|Tercer elemento [/LISTA]
```

**Lista Ordenada (numerada)**
```
[LISTA-NUM] Primer paso|Segundo paso|Tercer paso [/LISTA-NUM]
```

**IMPORTANTE:** Los elementos se separan con `|` (pipe), NO con comas ni saltos de línea.

**Ejemplo de uso:**
```
[LISTA] Durante lanzamiento: cada 3-5 días|Para cuentas estables: semanal|Lo importante es la constancia [/LISTA]
```

---

### 5. ENLACES

**Enlace externo**
```
[LINK] Texto del enlace|https://url-completa.com [/LINK]
```

**Formato:** `[LINK] texto visible|url completa [/LINK]`

**Ejemplo de uso:**
```
[LINK] Visita nuestro sitio web|https://libertyseller.es [/LINK]
```

---

### 6. CÓDIGO

**Código inline (para términos técnicos, comandos, etc.)**
```
[CODE] código o término técnico [/CODE]
```

**Ejemplo de uso:**
```
Usa el comando [CODE] git push [/CODE] para subir los cambios.
```

---

### 7. ELEMENTOS DE LÍNEA

**Salto de línea forzado**
```
[BR]
```

**Línea horizontal (separador visual)**
```
[HR]
```

---

## EJEMPLO COMPLETO DE ARTÍCULO

```
[H2] ¿Qué negativas uso: Exact o Phrase? [/H2]

Esta es una pregunta común entre gestores de Amazon. Te explicamos la diferencia:

[BOLD] Exact [/BOLD] se usa para bloquear una búsqueda específica (quirúrgico).

[BOLD] Phrase [/BOLD] se usa para bloquear familias de búsquedas (más agresivo).

Si el objetivo es evitar duplicación al pasar a "Manual Exact", la recomendación típica es [BOLD] Negativa Exact [/BOLD].

[HR]

[H2] ¿Cada cuánto hago la cosecha de keywords? [/H2]

La frecuencia recomendada es:

[LISTA] En fases de lanzamiento o cambios: cada 3-5 días|Para cuentas estables: semanal|Lo importante no es la frecuencia perfecta, sino la constancia [/LISTA]

[HR]

[H2] ¿Qué hago si Auto vende mejor que Manual? [/H2]

[CITA] No interpretes esto como "Auto es mejor". [/CITA]

Probablemente la campaña "Manual" esté mal configurada (match, pujas, presupuesto) o haya solapamiento entre campañas.

Las acciones recomendadas son:

[LISTA-NUM] Promover términos ganadores a "Manual"|Ajustar pujas|Bloquear duplicados en "Auto" [/LISTA-NUM]

Para más información, [LINK] visita nuestra página|https://libertyseller.es [/LINK].
```

---

## REGLAS DE USO

1. **Siempre cierra las etiquetas:** `[H2] texto [/H2]` ✓ | `[H2] texto` ✗

2. **Usa mayúsculas:** `[H2]` ✓ | `[h2]` ✗

3. **No anides etiquetas del mismo tipo:** `[BOLD] [BOLD] texto [/BOLD] [/BOLD]` ✗

4. **Puedes combinar etiquetas diferentes:** `[BOLD] [ITALIC] texto [/ITALIC] [/BOLD]` ✓

5. **En listas, usa `|` para separar:** `[LISTA] item1|item2|item3 [/LISTA]` ✓

6. **En enlaces, separa texto y URL con `|`:** `[LINK] texto|url [/LINK]` ✓

---

## TABLA DE REFERENCIA RÁPIDA

| Etiqueta | Propósito | Ejemplo |
|----------|-----------|---------|
| `[H1]...[/H1]` | Título principal | `[H1] Guía Completa [/H1]` |
| `[H2]...[/H2]` | Sección principal | `[H2] Introducción [/H2]` |
| `[H3]...[/H3]` | Subsección | `[H3] Detalles técnicos [/H3]` |
| `[H4]...[/H4]` | Sub-subsección | `[H4] Notas adicionales [/H4]` |
| `[BOLD]...[/BOLD]` | Negrita | `[BOLD] Importante [/BOLD]` |
| `[B]...[/B]` | Negrita (corta) | `[B] Importante [/B]` |
| `[ITALIC]...[/ITALIC]` | Cursiva | `[ITALIC] Término técnico [/ITALIC]` |
| `[I]...[/I]` | Cursiva (corta) | `[I] Término técnico [/I]` |
| `[CITA]...[/CITA]` | Cita destacada | `[CITA] Texto de la cita [/CITA]` |
| `[QUOTE]...[/QUOTE]` | Cita (alternativo) | `[QUOTE] Texto de la cita [/QUOTE]` |
| `[LISTA]...[/LISTA]` | Lista con viñetas | `[LISTA] item1\|item2\|item3 [/LISTA]` |
| `[LISTA-NUM]...[/LISTA-NUM]` | Lista numerada | `[LISTA-NUM] paso1\|paso2\|paso3 [/LISTA-NUM]` |
| `[LINK]...[/LINK]` | Enlace | `[LINK] texto\|url [/LINK]` |
| `[CODE]...[/CODE]` | Código | `[CODE] comando [/CODE]` |
| `[BR]` | Salto de línea | `[BR]` |
| `[HR]` | Línea horizontal | `[HR]` |

---

## INSTRUCCIONES FINALES PARA IA

Cuando generes contenido:
1. Usa estas etiquetas en lugar de HTML
2. Estructura el contenido con H2 para secciones principales
3. Usa H3 para subsecciones dentro de cada H2
4. Destaca información importante con [BOLD]
5. Usa [CITA] para testimonios, consejos clave o información destacada
6. Usa [LISTA] o [LISTA-NUM] para enumerar puntos
7. Incluye enlaces relevantes con [LINK]
8. Separa secciones visualmente con [HR] cuando sea necesario

**Recuerda:** El sistema convertirá automáticamente estas etiquetas a HTML, así que NO uses HTML directo en el contenido.
