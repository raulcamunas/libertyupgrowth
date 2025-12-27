// Este archivo contiene funciones JavaScript que se usarán en los componentes
// Funciones globales que necesitan estar disponibles en window

export function scrollToForm(e?: Event) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const currentScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0
  const targetScroll = 0
  
  const startTime = performance.now()
  const duration = 1000
  const distance = targetScroll - currentScroll
  
  function smoothScroll(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2
    
    const currentPosition = currentScroll + (distance * ease)
    
    window.scrollTo(0, currentPosition)
    document.documentElement.scrollTop = currentPosition
    if (document.body) {
      document.body.scrollTop = currentPosition
    }
    
    if (progress < 1) {
      requestAnimationFrame(smoothScroll)
    }
  }
  
  requestAnimationFrame(smoothScroll)
  return false
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  (window as any).scrollToForm = scrollToForm
}

