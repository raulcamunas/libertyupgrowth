// Script para verificar si Cloudflare Turnstile está configurado
// Ejecutar: node scripts/check-turnstile.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Cloudflare Turnstile...\n');

// Verificar .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📁 Archivo .env.local encontrado\n');
} else {
  console.log('⚠️  Archivo .env.local NO encontrado\n');
}

// Verificar variables
const hasSiteKey = envContent.includes('NEXT_PUBLIC_TURNSTILE_SITE_KEY');
const hasSecret = envContent.includes('CLOUDFLARE_TURNSTILE_SECRET');

console.log('Variables de entorno:');
console.log(hasSiteKey ? '  ✅ NEXT_PUBLIC_TURNSTILE_SITE_KEY' : '  ❌ NEXT_PUBLIC_TURNSTILE_SITE_KEY');
console.log(hasSecret ? '  ✅ CLOUDFLARE_TURNSTILE_SECRET' : '  ❌ CLOUDFLARE_TURNSTILE_SECRET');

// Verificar que tengan valores
if (hasSiteKey) {
  const siteKeyMatch = envContent.match(/NEXT_PUBLIC_TURNSTILE_SITE_KEY=(.+)/);
  if (siteKeyMatch && siteKeyMatch[1] && !siteKeyMatch[1].includes('tu_site_key')) {
    console.log(`     Valor: ${siteKeyMatch[1].substring(0, 20)}...`);
  } else {
    console.log('     ⚠️  Valor no configurado o es placeholder');
  }
}

if (hasSecret) {
  const secretMatch = envContent.match(/CLOUDFLARE_TURNSTILE_SECRET=(.+)/);
  if (secretMatch && secretMatch[1] && !secretMatch[1].includes('tu_secret_key')) {
    console.log(`     Valor: ${secretMatch[1].substring(0, 20)}...`);
  } else {
    console.log('     ⚠️  Valor no configurado o es placeholder');
  }
}

// Verificar archivos de código
console.log('\n📝 Archivos de código:');
const apiRoute = path.join(__dirname, '..', 'app', 'api', 'contact', 'route.ts');
const heroForm = path.join(__dirname, '..', 'components', 'HeroForm.tsx');

if (fs.existsSync(apiRoute)) {
  const apiContent = fs.readFileSync(apiRoute, 'utf8');
  const hasTurnstileVerify = apiContent.includes('verifyTurnstile');
  console.log(hasTurnstileVerify ? '  ✅ API route con verificación Turnstile' : '  ❌ API route sin verificación');
} else {
  console.log('  ❌ API route no encontrada');
}

if (fs.existsSync(heroForm)) {
  const formContent = fs.readFileSync(heroForm, 'utf8');
  const hasTurnstileWidget = formContent.includes('turnstile') || formContent.includes('Turnstile');
  console.log(hasTurnstileWidget ? '  ✅ HeroForm con widget Turnstile' : '  ❌ HeroForm sin widget');
} else {
  console.log('  ❌ HeroForm no encontrado');
}

console.log('\n💡 Para verificar en producción:');
console.log('   1. Ve a Vercel → Settings → Environment Variables');
console.log('   2. Verifica que ambas variables estén configuradas');
console.log('   3. Abre la consola del navegador y busca "turnstile"');
console.log('   4. Intenta enviar el formulario y revisa la pestaña Network');

