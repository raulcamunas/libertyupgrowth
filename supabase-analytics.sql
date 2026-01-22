-- ============================================
-- SUPABASE ANALYTICS SETUP
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- Ve a: SQL Editor > New Query > Pega este código > Run

-- 1. Crear tabla de analytics (visitas)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Información de la página
  page_path TEXT NOT NULL,
  page_title TEXT,
  page_type TEXT, -- 'home', 'blog', 'blog_post', 'admin', etc.
  
  -- Información del post (si aplica)
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  post_slug TEXT,
  
  -- Información del visitante
  session_id TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT,
  
  -- Información geográfica (opcional, se puede obtener del cliente)
  country TEXT,
  city TEXT,
  
  -- Información técnica
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  os TEXT,
  
  -- Métricas adicionales
  time_on_page INTEGER, -- en segundos
  scroll_depth INTEGER, -- porcentaje de scroll (0-100)
  
  -- Metadata adicional (JSON)
  metadata JSONB
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics_events(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_page_type ON analytics_events(page_type);
CREATE INDEX IF NOT EXISTS idx_analytics_post_id ON analytics_events(post_id);
CREATE INDEX IF NOT EXISTS idx_analytics_post_slug ON analytics_events(post_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics_events(session_id);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS

-- Política: Cualquiera puede insertar eventos (público)
DROP POLICY IF EXISTS "Public can insert events" ON analytics_events;
CREATE POLICY "Public can insert events" ON analytics_events
  FOR INSERT 
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden ver analytics
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON analytics_events;
CREATE POLICY "Authenticated users can view analytics" ON analytics_events
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- 5. Función para obtener estadísticas agregadas
CREATE OR REPLACE FUNCTION get_analytics_stats(
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
  total_views BIGINT,
  unique_visitors BIGINT,
  unique_sessions BIGINT,
  avg_time_on_page NUMERIC,
  top_pages JSONB,
  top_posts JSONB,
  views_by_day JSONB,
  device_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) as total_views,
      COUNT(DISTINCT session_id) as unique_sessions,
      AVG(time_on_page) as avg_time
    FROM analytics_events
    WHERE created_at BETWEEN start_date AND end_date
  ),
  top_pages_data AS (
    SELECT
      page_path,
      COUNT(*) as views,
      COUNT(DISTINCT session_id) as unique_visits
    FROM analytics_events
    WHERE created_at BETWEEN start_date AND end_date
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT 10
  ),
  top_posts_data AS (
    SELECT
      post_slug,
      post_id,
      COUNT(*) as views,
      COUNT(DISTINCT session_id) as unique_visits
    FROM analytics_events
    WHERE created_at BETWEEN start_date AND end_date
      AND post_id IS NOT NULL
    GROUP BY post_slug, post_id
    ORDER BY views DESC
    LIMIT 10
  ),
  views_by_day_data AS (
    SELECT
      DATE(created_at) as date,
      COUNT(*) as views,
      COUNT(DISTINCT session_id) as unique_visits
    FROM analytics_events
    WHERE created_at BETWEEN start_date AND end_date
    GROUP BY DATE(created_at)
    ORDER BY date
  ),
  device_data AS (
    SELECT
      device_type,
      COUNT(*) as views
    FROM analytics_events
    WHERE created_at BETWEEN start_date AND end_date
      AND device_type IS NOT NULL
    GROUP BY device_type
  )
  SELECT
    (SELECT total_views FROM stats),
    (SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE created_at BETWEEN start_date AND end_date),
    (SELECT unique_sessions FROM stats),
    (SELECT avg_time FROM stats),
    (SELECT jsonb_agg(jsonb_build_object('path', page_path, 'views', views, 'unique_visits', unique_visits)) FROM top_pages_data),
    (SELECT jsonb_agg(jsonb_build_object('slug', post_slug, 'post_id', post_id, 'views', views, 'unique_visits', unique_visits)) FROM top_posts_data),
    (SELECT jsonb_agg(jsonb_build_object('date', date, 'views', views, 'unique_visits', unique_visits)) FROM views_by_day_data),
    (SELECT jsonb_agg(jsonb_build_object('device', device_type, 'views', views)) FROM device_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NOTAS:
-- ============================================
-- 1. Esta tabla almacena todos los eventos de analytics
-- 2. Los datos son anónimos (no se almacenan datos personales)
-- 3. Solo usuarios autenticados pueden ver los analytics
-- 4. La función get_analytics_stats() proporciona estadísticas agregadas
-- 5. Puedes ejecutar consultas personalizadas según tus necesidades











