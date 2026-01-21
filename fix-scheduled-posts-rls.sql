-- ============================================
-- FIX: Permitir ver posts programados públicamente
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- Ve a: SQL Editor > New Query > Pega este código > Run
--
-- Este script agrega una política para que usuarios no autenticados
-- puedan ver posts programados (scheduled) para mostrar "próximamente"

-- Política: Posts programados son visibles públicamente (solo para preview)
DROP POLICY IF EXISTS "Scheduled posts are public preview" ON posts;
CREATE POLICY "Scheduled posts are public preview" ON posts
  FOR SELECT 
  USING (
    status = 'scheduled' AND 
    published_at IS NOT NULL AND
    published_at > NOW()
  );

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Después de ejecutar, verifica que la política se haya creado:
-- SELECT * FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Scheduled posts are public preview';

