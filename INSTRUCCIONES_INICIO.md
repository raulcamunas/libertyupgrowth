# 🚀 INSTRUCCIONES PARA INICIAR EL PROYECTO

## ✅ PASO 1: INSTALAR DEPENDENCIAS

Ejecuta estos comandos en la terminal:

```bash
cd "/Users/raulcamunas/Desktop/Liberty Seller Web"
npm install
```

Esto instalará todas las dependencias necesarias (Next.js, Supabase, Tiptap, etc.)

---

## ✅ PASO 2: CONFIGURAR SUPABASE

### 2.1 Crear proyecto en Supabase
1. Ve a https://supabase.com y crea una cuenta (si no la tienes)
2. Crea un nuevo proyecto
3. Anota tu **URL del proyecto** y las **API Keys**

### 2.2 Crear la tabla `posts`
1. Ve a **SQL Editor** en tu proyecto de Supabase
2. Ejecuta este SQL (copia y pega todo):

```sql
-- Crear tabla posts
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'published', 'scheduled')) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title TEXT,
  seo_description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);

-- RLS (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden crear/editar
CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Política: Posts publicados son visibles para todos
CREATE POLICY "Published posts are public" ON posts
  FOR SELECT USING (
    status = 'published' AND 
    (published_at IS NULL OR published_at <= NOW())
  );

-- Storage bucket para imágenes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política storage: usuarios autenticados pueden subir
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');
```

### 2.3 Crear usuario administrador
1. Ve a **Authentication** → **Users** en Supabase
2. Haz clic en **Add user** → **Create new user**
3. Crea un usuario con email y contraseña (guarda estas credenciales)

---

## ✅ PASO 3: CONFIGURAR VARIABLES DE ENTORNO

1. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
touch .env.local
```

2. Abre `.env.local` y añade:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

**Dónde encontrar las keys:**
- Ve a tu proyecto en Supabase
- **Settings** → **API**
- Copia:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ MANTÉN ESTA SECRETA)

---

## ✅ PASO 4: MIGRAR IMÁGENES

Las imágenes ya están en la carpeta raíz. Necesitas moverlas a `public/`:

```bash
# Mover imágenes a public
mv logo.png icon.png partner_*.png testimonio*.png public/
```

---

## ✅ PASO 5: EXTRAER CSS A globals.css

**IMPORTANTE:** El archivo `index.html` tiene ~4000 líneas de CSS inline. Necesitas:

1. Abrir `index.html`
2. Copiar TODO el contenido dentro de `<style>` (desde la línea 98 hasta donde termine)
3. Pegarlo en `styles/globals.css`
4. Añadir al inicio de `globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## ✅ PASO 6: INICIAR EL SERVIDOR DE DESARROLLO

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

---

## 📝 PRÓXIMOS PASOS (Después de la migración base)

1. **Migrar componentes:** Convertir secciones del HTML a componentes React
2. **Crear rutas del blog:** `/blog` y `/blog/[slug]`
3. **Crear panel admin:** `/admin` con autenticación
4. **Implementar editor:** Tiptap para crear/editar posts

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Supabase client not initialized"
- Verifica que `.env.local` existe y tiene las variables correctas
- Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

### Error: "Cannot find module '@supabase/ssr'"
```bash
npm install @supabase/ssr@latest
```

---

## 📚 RECURSOS ÚTILES

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tiptap Docs](https://tiptap.dev/docs)

---

**¿Listo para empezar?** Ejecuta los comandos del Paso 1 y continúa con los siguientes pasos. 🚀

