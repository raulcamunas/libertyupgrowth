'use client'

import { useEffect, useState } from 'react'

interface ScheduleCountdownProps {
  publishedAt: string
}

export default function ScheduleCountdown({ publishedAt }: ScheduleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [formattedDate, setFormattedDate] = useState<string>('')

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

      // Formatear fecha
      const dateStr = publishDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      setFormattedDate(dateStr)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [publishedAt])

  return (
    <div className="admin-schedule-info">
      <span className="admin-schedule-countdown">
        <i className="fa-solid fa-clock text-xs"></i>
        {timeLeft}
      </span>
      <span className="admin-schedule-date">
        <i className="fa-solid fa-calendar-days text-xs"></i>
        {formattedDate}
      </span>
    </div>
  )
}

