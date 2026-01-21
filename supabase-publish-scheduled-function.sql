-- ============================================
-- FUNCIÓN SUPABASE PARA PUBLICAR POSTS PROGRAMADOS
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- Ve a: SQL Editor > New Query > Pega este código > Run
--
-- Esta función actualiza automáticamente los posts programados
-- a "published" cuando llega su fecha de publicación

-- Función para publicar posts programados
CREATE OR REPLACE FUNCTION publish_scheduled_posts()
RETURNS TABLE(
  published_count INTEGER,
  published_posts JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_published_count INTEGER;
  v_published_posts JSONB;
BEGIN
  -- Actualizar posts programados cuya fecha ya pasó
  WITH updated AS (
    UPDATE posts
    SET 
      status = 'published',
      updated_at = NOW()
    WHERE 
      status = 'scheduled' 
      AND published_at IS NOT NULL
      AND published_at <= NOW()
    RETURNING id, title, slug
  )
  SELECT 
    COUNT(*)::INTEGER,
    COALESCE(jsonb_agg(jsonb_build_object(
      'id', id,
      'title', title,
      'slug', slug
    )), '[]'::jsonb)
  INTO v_published_count, v_published_posts
  FROM updated;
  
  RETURN QUERY SELECT v_published_count, v_published_posts;
END;
$$;

-- ============================================
-- CONFIGURAR CRON JOB EN SUPABASE
-- ============================================
-- Para que esta función se ejecute automáticamente cada minuto,
-- necesitas configurar un cron job en Supabase:
--
-- 1. Ve a Database > Extensions
-- 2. Habilita la extensión "pg_cron" si no está habilitada
-- 3. Ejecuta este SQL para crear el cron job:

-- Habilitar extensión pg_cron (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Crear cron job que ejecuta la función cada minuto
SELECT cron.schedule(
  'publish-scheduled-posts',           -- Nombre del job
  '* * * * *',                         -- Cada minuto (cron syntax)
  $$SELECT publish_scheduled_posts()$$  -- Función a ejecutar
);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Para ver los cron jobs activos:
-- SELECT * FROM cron.job;
--
-- Para ver el historial de ejecuciones:
-- SELECT * FROM cron.job_run_details WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'publish-scheduled-posts');
--
-- Para probar la función manualmente:
-- SELECT * FROM publish_scheduled_posts();
--
-- Para eliminar el cron job (si es necesario):
-- SELECT cron.unschedule('publish-scheduled-posts');

