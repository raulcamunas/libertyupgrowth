# 🚀 PLAN DE MIGRACIÓN: HTML → Next.js 14 + Supabase

## 📋 RESUMEN EJECUTIVO

Migrar landing page estática a Next.js 14 (App Router) con:
- ✅ Blog público con CMS personalizado
- ✅ Panel de administración protegido
- ✅ Autenticación con Supabase
- ✅ Preservación exacta del diseño actual

---

## 🛠️ COMANDOS DE INSTALACIÓN

### 1. Inicializar Next.js 14
```bash
cd "/Users/raulcamunas/Desktop/Liberty Seller Web"
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

**Cuando pregunte:**
- ✅ TypeScript: Yes
- ✅ ESLint: Yes  
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: No
- ✅ App Router: Yes
- ✅ Import alias: `@/*`

### 2. Instalar dependencias adicionales
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
npm install date-fns
npm install zod
npm install react-hook-form @hookform/resolvers
```

### 3. Instalar dependencias de desarrollo
```bash
npm install -D @types/node
```

---

## 📁 ESTRUCTURA DE CARPETAS FINAL

```
Liberty Seller Web/
├── app/
│   ├── layout.tsx              # Layout principal con Navbar
│   ├── page.tsx                # Landing page (migrada)
│   ├── blog/
│   │   ├── page.tsx            # Lista de posts
│   │   └── [slug]/
│   │       └── page.tsx        # Post individual
│   ├── admin/
│   │   ├── layout.tsx          # Layout protegido
│   │   ├── page.tsx            # Dashboard
│   │   ├── login/
│   │   │   └── page.tsx        # Login
│   │   └── posts/
│   │       ├── new/
│   │       │   └── page.tsx    # Crear post
│   │       └── [id]/
│   │           └── page.tsx    # Editar post
│   └── api/
│       └── auth/
│           └── callback/
│               └── route.ts   # Supabase auth callback
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   └── ... (otros componentes)
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Cliente Supabase (browser)
│   │   ├── server.ts           # Cliente Supabase (server)
│   │   └── middleware.ts       # Middleware para auth
│   └── utils.ts
├── styles/
│   └── globals.css             # Todos los estilos migrados
├── public/
│   ├── logo.png
│   ├── icon.png
│   └── ... (imágenes)
└── types/
    └── database.ts             # Tipos TypeScript de Supabase
```

---

## 🗄️ CONFIGURACIÓN SUPABASE

### 1. Crear proyecto en Supabase
- Ve a https://supabase.com
- Crea nuevo proyecto
- Guarda: `SUPABASE_URL` y `SUPABASE_ANON_KEY`

### 2. SQL para crear tabla `posts`
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
VALUES ('blog-images', 'blog-images', true);

-- Política storage: usuarios autenticados pueden subir
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);
```

### 3. Variables de entorno (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key (solo para server actions)
```

---

## 🎨 PRESERVACIÓN DE ESTILOS

### Variables CSS (mantener en globals.css)
```css
:root {
  --brand-color: #FF6600;
  --bg-color: #080808;
  --border-color: rgba(255,255,255,0.1);
  --glass-bg: rgba(255, 255, 255, 0.03);
}
```

### Tailwind Config (tailwind.config.ts)
```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#FF6600',
        'bg-dark': '#080808',
      },
    },
  },
}
```

---

## ✅ CHECKLIST DE MIGRACIÓN

### Fase 1: Setup Base
- [ ] Inicializar Next.js 14
- [ ] Instalar dependencias
- [ ] Configurar Supabase
- [ ] Crear estructura de carpetas

### Fase 2: Migración Landing
- [ ] Extraer CSS a globals.css
- [ ] Migrar componentes principales
- [ ] Migrar JavaScript a componentes React
- [ ] Verificar diseño idéntico

### Fase 3: Blog Público
- [ ] Crear /blog con grid de posts
- [ ] Crear /blog/[slug] con SEO
- [ ] Implementar artículos relacionados

### Fase 4: Panel Admin
- [ ] Crear /admin/login
- [ ] Proteger rutas /admin
- [ ] Dashboard con lista de posts
- [ ] Editor con Tiptap
- [ ] Upload de imágenes a Supabase Storage

### Fase 5: Testing & Deploy
- [ ] Probar en local
- [ ] Configurar Vercel
- [ ] Variables de entorno en Vercel
- [ ] Deploy y verificación

---

## 🚀 PRÓXIMOS PASOS

1. Ejecutar comandos de instalación
2. Configurar Supabase
3. Empezar migración componente por componente
4. Testing exhaustivo
5. Deploy a Vercel

