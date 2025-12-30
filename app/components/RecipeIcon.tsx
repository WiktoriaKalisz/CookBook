'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface RecipeIconProps {
  type: 'vegan' | 'vegetarian' | 'spicy'
  width?: number
  height?: number
  alt?: string
}

export function RecipeIcon({ type, width = 20, height = 20, alt }: RecipeIconProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === 'dark'
  const iconMap = {
    vegan: isDark ? '/icons/vegan2.png' : '/icons/vegan.png',
    vegetarian: isDark ? '/icons/vegetarian2.png' : '/icons/vegetarian.png',
    spicy: isDark ? '/icons/spicy2.png' : '/icons/spicy.png',
  }

  return (
    <Image
      src={iconMap[type]}
      alt={alt || type}
      width={width}
      height={height}
    />
  )
}
