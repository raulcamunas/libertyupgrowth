-- ============================================
-- ACTUALIZAR POLÍTICAS RLS PARA COMPARTIR POSTS
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- Ve a: SQL Editor > New Query > Pega este código > Run
--
-- Este script actualiza las políticas para que todos los usuarios
-- autenticados puedan ver, editar y eliminar todos los posts

-- 1. Eliminar políticas antiguas que limitan por user_id
DROP POLICY IF EXISTS "Users can view own posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

-- 2. Crear nuevas políticas que permiten acceso a todos los usuarios autenticados

-- Política: Todos los usuarios autenticados pueden ver todos los posts
CREATE POLICY "Authenticated users can view all posts" ON posts
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Política: Todos los usuarios autenticados pueden actualizar todos los posts
CREATE POLICY "Authenticated users can update all posts" ON posts
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Política: Todos los usuarios autenticados pueden eliminar todos los posts
CREATE POLICY "Authenticated users can delete all posts" ON posts
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Nota: La política "Users can create posts" ya permite a todos crear posts,
-- así que no necesita cambios.

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Después de ejecutar, verifica que las políticas se hayan creado correctamente:
-- SELECT * FROM pg_policies WHERE tablename = 'posts';

