-- Añadir columna reading_time a la tabla posts
-- Ejecuta este SQL en el SQL Editor de Supabase

ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS reading_time INTEGER;

-- Comentario: Tiempo de lectura estimado en minutos

