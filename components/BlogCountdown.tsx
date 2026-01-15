'use client'

import { useEffect, useState } from 'react'

interface BlogCountdownProps {
  publishedAt: string
}

export default function BlogCountdown({ publishedAt }: BlogCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const publishDate = new Date(publishedAt)
      const diff = publishDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('Publicado')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      let timeString = ''
      if (days > 0) {
        timeString = `${days}d ${hours}h`
      } else if (hours > 0) {
        timeString = `${hours}h ${minutes}m`
      } else {
        timeString = `${minutes}m`
      }

      setTimeLeft(timeString)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [publishedAt])

  return (
    <span className="blog-upcoming-countdown">
      <i className="fa-solid fa-clock"></i>
      {timeLeft}
    </span>
  )
}

