/**
 * Script para crear un nuevo usuario administrador en Supabase
 * Ejecutar con: node scripts/create-admin-user.js
 * 
 * Asegúrate de tener las variables de entorno configuradas en .env.local
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno. Asegúrate de tener:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function createAdminUser() {
  console.log('🚀 Crear nuevo usuario administrador\n')

  try {
    const email = await question('📧 Email: ')
    if (!email) {
      console.error('❌ El email es requerido')
      rl.close()
      process.exit(1)
    }

    const password = await question('🔒 Contraseña (mínimo 6 caracteres): ')
    if (!password || password.length < 6) {
      console.error('❌ La contraseña debe tener al menos 6 caracteres')
      rl.close()
      process.exit(1)
    }

    console.log('\n⏳ Creando usuario...')

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar el email
    })

    if (error) {
      console.error('❌ Error al crear usuario:', error.message)
      
      if (error.message.includes('already registered')) {
        console.log('\n💡 El usuario ya existe. Puedes:')
        console.log('   1. Usar otro email')
        console.log('   2. Resetear la contraseña desde Supabase Dashboard')
        console.log('   3. Intentar iniciar sesión con las credenciales existentes')
      }
      
      rl.close()
      process.exit(1)
    }

    console.log('\n✅ Usuario creado exitosamente!')
    console.log('📧 Email:', data.user.email)
    console.log('🆔 User ID:', data.user.id)
    console.log('\n💡 Ahora puedes iniciar sesión en: http://localhost:3000/admin/login')
    console.log('   Email:', email)
    console.log('   Password:', '*'.repeat(password.length))

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    rl.close()
  }
}

createAdminUser()





