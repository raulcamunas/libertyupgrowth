# 🗄️ CONFIGURACIÓN DE SUPABASE - PASOS FINALES

## ✅ Ya completado
- [x] Variables de entorno configuradas en `.env.local`
- [x] SQL de setup creado en `supabase-setup.sql`

## 📋 PASOS PARA COMPLETAR LA CONFIGURACIÓN

### Paso 1: Ejecutar el SQL en Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/gqnsfdfuhowrjwyaxkec
2. Ve a **SQL Editor** (menú lateral izquierdo)
3. Haz clic en **New Query**
4. Abre el archivo `supabase-setup.sql` en tu editor
5. Copia TODO el contenido del archivo
6. Pégalo en el editor de SQL de Supabase
7. Haz clic en **Run** (o presiona Cmd/Ctrl + Enter)

**✅ Deberías ver:** "Success. No rows returned"

### Paso 2: Crear Usuario Administrador

1. En Supabase, ve a **Authentication** → **Users**
2. Haz clic en **Add user** → **Create new user**
3. Completa:
   - **Email**: tu-email@ejemplo.com
   - **Password**: (crea una contraseña segura)
   - **Auto Confirm User**: ✅ (marca esta casilla)
4. Haz clic en **Create user**

**⚠️ IMPORTANTE:** Guarda estas credenciales, las necesitarás para loguearte en `/admin`

### Paso 3: Verificar que todo funciona

1. Ve a **Table Editor** → **posts**
   - Deberías ver la tabla vacía (esto es normal)

2. Ve a **Storage** → **Buckets**
   - Deberías ver el bucket `blog-images` creado

3. Prueba crear un post de prueba (opcional):
   ```sql
   INSERT INTO posts (title, slug, content, author, status, user_id)
   VALUES (
     'Mi Primer Post',
     'mi-primer-post',
     '<p>Este es el contenido de mi primer post.</p>',
     'Admin',
     'published',
     (SELECT id FROM auth.users LIMIT 1)
   );
   ```

## 🚀 Siguiente Paso

Una vez completado esto, podemos:
1. Crear el panel de administración `/admin`
2. Crear las páginas públicas del blog `/blog`
3. Implementar el editor de posts con Tiptap

## 📝 Notas

- El archivo `.env.local` ya está configurado con tus keys
- El SQL crea todas las políticas de seguridad necesarias
- Los posts publicados serán visibles para todos
- Solo usuarios autenticados pueden crear/editar posts

