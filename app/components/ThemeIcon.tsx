'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ThemeIconProps {
  type: 'logo' | 'theme-toggle'
  width?: number
  height?: number
  onClick?: () => void
  className?: string
  alt?: string
}

export function ThemeIcon({
  type,
  width = 40,
  height = 40,
  onClick,
  className = '',
  alt = 'Icon',
}: ThemeIconProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ width, height }} />
  }

  const isDark = resolvedTheme === 'dark'

  let src = ''
  if (type === 'logo') {
    src = isDark ? '/icons/restaurant2.png' : '/icons/restaurant.png'
  } else if (type === 'theme-toggle') {
    src = isDark ? '/icons/sun.png' : '/icons/moon.png'
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      onClick={onClick}
      className={className}
    />
  )
}
