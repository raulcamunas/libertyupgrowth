-- ============================================
-- SUPABASE SETUP SQL PARA LIBERTY SELLER BLOG
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- Ve a: SQL Editor > New Query > Pega este código > Run

-- 1. Crear tabla posts
CREATE TABLE IF NOT EXISTS posts (
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

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);

-- 3. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Trigger para updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 6. Políticas RLS

-- Política: Usuarios autenticados pueden crear posts
DROP POLICY IF EXISTS "Users can create posts" ON posts;
CREATE POLICY "Users can create posts" ON posts
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Política: Todos los usuarios autenticados pueden ver todos los posts
DROP POLICY IF EXISTS "Users can view own posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON posts;
CREATE POLICY "Authenticated users can view all posts" ON posts
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Política: Todos los usuarios autenticados pueden actualizar todos los posts
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can update all posts" ON posts;
CREATE POLICY "Authenticated users can update all posts" ON posts
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Política: Todos los usuarios autenticados pueden eliminar todos los posts
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can delete all posts" ON posts;
CREATE POLICY "Authenticated users can delete all posts" ON posts
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Política: Posts publicados son visibles para todos (público)
DROP POLICY IF EXISTS "Published posts are public" ON posts;
CREATE POLICY "Published posts are public" ON posts
  FOR SELECT 
  USING (
    status = 'published' AND 
    (published_at IS NULL OR published_at <= NOW())
  );

-- 7. Storage bucket para imágenes del blog
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Políticas de Storage

-- Política: Usuarios autenticados pueden subir imágenes
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);

-- Política: Usuarios autenticados pueden actualizar sus propias imágenes
DROP POLICY IF EXISTS "Authenticated users can update own images" ON storage.objects;
CREATE POLICY "Authenticated users can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);

-- Política: Usuarios autenticados pueden eliminar sus propias imágenes
DROP POLICY IF EXISTS "Authenticated users can delete own images" ON storage.objects;
CREATE POLICY "Authenticated users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);

-- Política: Cualquiera puede ver imágenes públicas
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- ============================================
-- NOTAS:
-- ============================================
-- 1. Después de ejecutar este SQL, crea un usuario administrador:
--    - Ve a Authentication > Users > Add user > Create new user
--    - Usa email y contraseña (guarda estas credenciales)
--
-- 2. El usuario creado podrá:
--    - Crear, editar y eliminar posts
--    - Subir imágenes al bucket 'blog-images'
--
-- 3. Los posts con status='published' y published_at <= NOW() serán visibles públicamente
--
-- 4. Para testing, puedes crear un post de prueba directamente en Supabase:
--    INSERT INTO posts (title, slug, content, author, status, user_id)
--    VALUES ('Test Post', 'test-post', 'Contenido de prueba', 'Admin', 'published', 'TU_USER_ID_AQUI');

