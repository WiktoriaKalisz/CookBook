'use client'

import { useEffect, useState } from "react"
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { ThemeIcon, RecipeIcon } from '@/app/components'

interface Ingredient {
  name: string
  amount?: number
  unit?: string
}

interface Recipe {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  category?: string
  servings?: number
  prepTime?: number
  cookTime?: number
  isVegan?: boolean
  isVegetarian?: boolean
  isSpicy?: boolean
  difficulty?: string
  image?: object
  ingredients?: (Ingredient | string)[]
  instructions?: string[]
}

export default function RecipeDetails({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(recipe.servings || 1)
  const originalServings = recipe.servings || 1
  const multiplier = servings / originalServings
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 font-serif">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Link href="/">
          {mounted && (
            <ThemeIcon
              type="logo"
              width={40}
              height={40}
              className="cursor-pointer"
              alt="Logo"
            />
          )}
        </Link>

        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1"
            aria-label="Toggle theme"
          >
            <ThemeIcon
              type="theme-toggle"
              width={24}
              height={24}
              alt="Toggle theme"
            />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-14">

        <div className="flex-1 pl-20">

          <h1 className="text-6xl font-bold mb-10 max-w-xl">{recipe.title}</h1>

          <div className="flex items-center gap-4 mb-8 text-sm">
            {recipe.isVegan && (
              <div className="flex items-center gap-1">
                <RecipeIcon type="vegan" width={20} height={20} alt="Vegan" />
                Vegan
              </div>
            )}
            {recipe.isVegetarian && (
              <div className="flex items-center gap-1">
                <RecipeIcon type="vegetarian" width={20} height={20} alt="Vegetarian" />
                Vegetarian
              </div>
            )}
            {recipe.isSpicy && (
              <div className="flex items-center gap-1">
                <RecipeIcon type="spicy" width={20} height={20} alt="Spicy" />
                Spicy
              </div>
            )}
            {recipe.difficulty && mounted && (
              <span
                className="ml-5 relative top-[2px] text-sm capitalize border rounded-full px-3 py-1"
                style={{
                  borderColor: resolvedTheme === "dark" ? "#fcf5eb" : "#37599d",
                  color: resolvedTheme === "dark" ? "#fcf5eb" : "#37599d",
                }}
              >
                {recipe.difficulty}
              </span>
            )}
          </div>


          <div className="mb-4 space-y-1">
            {recipe.prepTime && <p><strong>Prep time:</strong> {recipe.prepTime} min</p>}
            {recipe.cookTime && <p><strong>Cook time:</strong> {recipe.cookTime} min</p>}
            <p><strong>Servings:</strong> {servings}</p>
          </div>

          {/* Description */}
          {recipe.description && (
            <div className="max-w-md">
              <p className="text-base mb-15 leading-relaxed">{recipe.description}</p>
            </div>
          )}

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-15">
              <h2 className="text-3xl font-semibold mb-4 font-serif">Ingredients</h2>

              {/* Servings */}
              <div className="flex items-center gap-4 mb-8">
                <span>Makes:</span>
                <div
                  className="inline-flex items-center rounded-full px-4 py-1 min-w-[4.5rem] justify-center gap-3"
                  style={{
                    backgroundColor: mounted && resolvedTheme === "dark" ? "#fcf5eb" : "#37599d",
                    color: mounted && resolvedTheme === "dark" ? "#37599d" : "#fcf5eb",
                  }}
                >
                  <button
                    onClick={() => setServings((s: number) => Math.max(1, s - 1))}
                    className="rounded-full w-6 h-6 flex items-center justify-center text-lg leading-none select-none transition"
                    style={{
                      borderColor: mounted && resolvedTheme === "dark" ? "#37599d" : "#fcf5eb",
                      color: mounted && resolvedTheme === "dark" ? "#37599d" : "#fcf5eb",
                      backgroundColor: "transparent",
                    }}
                    aria-label="Decrease servings"
                    onMouseEnter={e => {
                      if (!mounted) return
                      e.currentTarget.style.backgroundColor =
                        resolvedTheme === "dark" ? "rgba(55, 89, 157, 0.2)" : "#2f357d"
                    }}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    -
                  </button>

                  <span className="font-semibold">{servings}</span>

                  <button
                    onClick={() => setServings((s: number) => s + 1)}
                    className="rounded-full w-6 h-6 flex items-center justify-center text-lg leading-none select-none transition"
                    style={{
                      borderColor: mounted && resolvedTheme === "dark" ? "#37599d" : "#fcf5eb",
                      color: mounted && resolvedTheme === "dark" ? "#37599d" : "#fcf5eb",
                      backgroundColor: "transparent",
                    }}
                    aria-label="Increase servings"
                    onMouseEnter={e => {
                      if (!mounted) return
                      e.currentTarget.style.backgroundColor =
                        resolvedTheme === "dark" ? "rgba(55, 89, 157, 0.2)" : "#2f357d"
                    }}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    +
                  </button>
                </div>
                <span>servings</span>
              </div>

              {/* Ingredients */}
              <ul className="space-y-1">
              {recipe.ingredients.map((item, i) => {
                  if (typeof item === 'string') return <li key={i}>• {item}</li>

                  return (
                    <li key={i} className="flex items-center gap-2">
                      {/* Dot for ingredient */}
                      <span
                        className="inline-block w-1 h-1 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: mounted && resolvedTheme === "dark" ? "#fcf5eb" : "#37599d",
                        }}
                      ></span>

{item.amount !== undefined && (
    <span className="text-[#93928e] w-20">
      {Math.round(item.amount * multiplier * 100) / 100} {item.unit}
    </span>
  )}

                      <span>{item.name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Instructions */}
{recipe.instructions && recipe.instructions.length > 0 && (
  <div>
    <h2 className="text-3xl font-semibold mb-8">Instructions</h2>
    <ol className="list-decimal list-inside space-y-2">
      {recipe.instructions.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  </div>
)}
        </div>

        {mounted && recipe.image && (
          <div className="relative w-full flex justify-center lg:absolute lg:inset-0 lg:overflow-hidden lg:pointer-events-none">
            <div className="relative w-60 h-60 lg:absolute lg:top-20 lg:-right-50 lg:w-[550px] lg:h-[1100px] lg:scale-125">

              {/* Plate */}
              <Image
                src={resolvedTheme === "dark" ? "/icons/plate2.png" : "/icons/plate.png"}
                alt="Food icon"
                fill
                className="object-contain"
              />

              {/* Recipe image */}
              {mounted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 lg:w-98 lg:h-98 relative">
                    <Image
                      src={urlFor(recipe.image).width(800).height(800).url()}
                      alt={recipe.title}
                      width={800}
                      height={800}
                      className="object-cover w-full h-full rounded-full -translate-y-[3px]"
                      style={{
                        maskImage: resolvedTheme === "dark"
                          ? "radial-gradient(circle, white 50%, transparent 53%)"
                          : "radial-gradient(circle, white 50%, transparent 60%)",
                        WebkitMaskImage: resolvedTheme === "dark"
                          ? "radial-gradient(circle, white 50%, transparent 53%)"
                          : "radial-gradient(circle, white 50%, transparent 60%)",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                        maskSize: "cover",
                        WebkitMaskSize: "cover",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider line */}
      <div className="w-full bg-[#37599d] mt-15" style={{ height: "1px" }} />
    </div>
  )
}
