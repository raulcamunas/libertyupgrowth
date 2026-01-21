# Guía de Verificación de Eventos de Conversión

## 1. Verificación en el Navegador (Más Rápida)

### Paso 1: Abrir la Consola
1. Abre tu sitio web en el navegador
2. Presiona `F12` o clic derecho → "Inspeccionar"
3. Ve a la pestaña **"Console"**

### Paso 2: Verificar dataLayer
1. En la consola, escribe: `dataLayer` y presiona Enter
2. Deberías ver un array con eventos

### Paso 3: Probar un Formulario
1. **Llena y envía un formulario** (Hero, Blog o Modal)
2. Inmediatamente después, en la consola escribe:
   ```javascript
   dataLayer[dataLayer.length - 1]
   ```
3. Deberías ver algo como:
   ```javascript
   {
     event: "form_submit",
     form_id: "signup-form",
     form_name: "hero_form",
     conversion_type: "form_submission"
   }
   ```

### Paso 4: Probar WhatsApp
1. **Haz clic en el botón de WhatsApp**
2. En la consola, verifica el último evento:
   ```javascript
   dataLayer[dataLayer.length - 1]
   ```
3. Deberías ver:
   ```javascript
   {
     event: "whatsapp_click",
     conversion_type: "whatsapp_contact",
     button_location: "floating_widget"
   }
   ```

---

## 2. Verificación con Google Tag Manager Preview (Recomendado)

### Paso 1: Activar Preview Mode
1. Ve a [Google Tag Manager](https://tagmanager.google.com)
2. Haz clic en **"Vista previa"** (botón naranja arriba a la derecha)
3. Ingresa la URL de tu sitio: `https://libertyseller.com` (o tu dominio)
4. Haz clic en **"Conectar"**

### Paso 2: Probar Eventos
1. Se abrirá una nueva pestaña con tu sitio
2. En la parte inferior verás el panel de GTM Preview
3. **Envía un formulario** o **haz clic en WhatsApp**
4. En el panel de GTM deberías ver:
   - ✅ Evento `form_submit` o `whatsapp_click` disparado
   - ✅ Etiqueta "GA4 - Formulario Lead" o "GA - Click Whatsapp" activada
   - ✅ Sin errores en rojo

### Paso 3: Ver Detalles
- Haz clic en el evento para ver todos los detalles
- Verifica que los parámetros estén correctos

---

## 3. Verificación en Google Analytics (Tiempo Real)

### Paso 1: Ir a GA4
1. Ve a [Google Analytics](https://analytics.google.com)
2. Selecciona tu propiedad GA4

### Paso 2: Ver Tiempo Real
1. En el menú lateral, ve a **"Informes"** → **"Tiempo real"**
2. Espera unos segundos para que cargue

### Paso 3: Probar Eventos
1. **Envía un formulario** o **haz clic en WhatsApp**
2. En la sección **"Eventos por nombre de evento"** deberías ver:
   - `generate_lead` (para formularios)
   - El evento de WhatsApp (si está configurado)

---

## 4. Verificación en Network Tab (Avanzado)

### Paso 1: Abrir Network
1. Abre DevTools (`F12`)
2. Ve a la pestaña **"Network"** (Red)

### Paso 2: Filtrar Peticiones
1. En el buscador de Network, escribe: `collect` o `google-analytics`
2. Esto filtrará solo las peticiones a Google Analytics

### Paso 3: Probar y Verificar
1. **Envía un formulario** o **haz clic en WhatsApp**
2. Deberías ver una nueva petición a:
   ```
   https://www.google-analytics.com/g/collect
   ```
3. Haz clic en la petición y ve a la pestaña **"Payload"** o **"Parámetros"**
4. Busca el parámetro `en` (event name) que debería ser:
   - `generate_lead` para formularios
   - El nombre del evento de WhatsApp

---

## 5. Verificación en Google Ads (Si está Configurado)

### Paso 1: Ir a Conversiones
1. Ve a [Google Ads](https://ads.google.com)
2. En el menú lateral: **"Herramientas y configuración"** → **"Conversiones"**

### Paso 2: Verificar Conversiones
1. Si tienes conversiones configuradas, deberías ver:
   - Conversión de formularios
   - Conversión de WhatsApp
2. Las conversiones pueden tardar **24-48 horas** en aparecer

---

## Checklist de Verificación

- [ ] Evento `form_submit` aparece en `dataLayer` cuando se envía un formulario
- [ ] Evento `whatsapp_click` aparece en `dataLayer` cuando se hace clic en WhatsApp
- [ ] GTM Preview muestra que los triggers se disparan correctamente
- [ ] Las etiquetas GA4 se activan en GTM Preview
- [ ] Los eventos aparecen en Google Analytics Tiempo Real
- [ ] Las peticiones a Google Analytics se envían correctamente (Network tab)

---

## Solución de Problemas

### Si no ves eventos en dataLayer:
- Verifica que el código se haya desplegado correctamente
- Asegúrate de que no hay errores en la consola del navegador
- Verifica que GTM esté cargado (deberías ver `dataLayer` inicializado)

### Si GTM Preview no muestra eventos:
- Verifica que el trigger esté configurado como "Evento personalizado"
- Verifica que el nombre del evento coincida exactamente: `form_submit` o `whatsapp_click`
- Asegúrate de que las etiquetas estén asociadas a los triggers correctos

### Si no aparecen en Google Analytics:
- Verifica que el ID de medición GA4 sea correcto: `G-X7537EW6TP`
- Espera 1-2 minutos (puede haber un pequeño retraso)
- Verifica que no haya bloqueadores de anuncios activos

