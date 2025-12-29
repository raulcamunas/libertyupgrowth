# Configuración de Cloudflare Turnstile

## ¿Qué es Cloudflare Turnstile?

Cloudflare Turnstile es un servicio gratuito de verificación anti-bots que protege el formulario de contacto de spam y bots automatizados.

## Pasos para configurar

### 1. Crear cuenta en Cloudflare (si no tienes una)

1. Ve a [cloudflare.com](https://www.cloudflare.com)
2. Crea una cuenta gratuita

### 2. Configurar Turnstile

1. Ve al dashboard de Cloudflare
2. Navega a **Turnstile** en el menú lateral
3. Haz clic en **Add Site**
4. Completa el formulario:
   - **Site name**: Liberty Seller Web
   - **Domain**: Tu dominio (ej: `libertyseller.com` o `localhost` para desarrollo)
   - **Widget mode**: Selecciona **Invisible** (el widget no se mostrará, funcionará automáticamente)
5. Haz clic en **Create**

### 3. Obtener las keys

Después de crear el sitio, verás:
- **Site Key** (pública) - Se usa en el frontend
- **Secret Key** (privada) - Se usa en el backend

### 4. Añadir las keys al proyecto

1. Crea un archivo `.env.local` en la raíz del proyecto (si no existe)
2. Añade las siguientes variables:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=tu_site_key_aqui
CLOUDFLARE_TURNSTILE_SECRET=tu_secret_key_aqui
```

### 5. Para producción (Vercel)

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** > **Environment Variables**
3. Añade las mismas variables:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `CLOUDFLARE_TURNSTILE_SECRET`
4. Haz redeploy del proyecto

## Características implementadas

✅ **Protección anti-bots**: Turnstile verifica que el usuario es humano
✅ **Rate limiting**: Máximo 5 envíos por hora por IP
✅ **Honeypot field**: Campo oculto que detecta bots
✅ **Validación del servidor**: Verificación de datos antes de enviar al webhook
✅ **Sin geobloqueo**: El formulario está disponible para todos los países

## Notas

- El widget es **invisible**, los usuarios no verán ningún captcha
- Si Turnstile no está configurado, el formulario mostrará un error
- El rate limiting se resetea cada hora por IP
- Los datos se validan tanto en cliente como en servidor



