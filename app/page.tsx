"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"
import { getRecipes } from "@/sanity/lib/getRecipes"
import { FaSearch } from "react-icons/fa"
import { useTheme } from "next-themes"

interface Recipe {
  _id: string
  title: string
  slug: { current: string }
  category?: string
  image?: object
  isVegan?: boolean
  isVegetarian?: boolean
  isSpicy?: boolean
  difficulty: string
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [difficulty, setDifficulty] = useState("")

  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await getRecipes()
      setRecipes(data)
    }
    fetchData()
  }, [])

  // Filter recipes
  const filtered = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter
      ? (filter === "Spicy" && recipe.isSpicy) ||
        (filter === "Vegetarian" && recipe.isVegetarian) ||
        (filter === "Vegan" && recipe.isVegan)
      : true;
    
    const matchesDifficulty = difficulty
      ? (difficulty === "Easy" && recipe.difficulty === "easy") ||
        (difficulty === "Medium" && recipe.difficulty === "medium") ||
        (difficulty === "Hard" && recipe.difficulty === "hard")
      : true;

    return matchesSearch && matchesFilter && matchesDifficulty;
  });

  const getIcon = (type: "vegan" | "vegetarian" | "spicy") => {
    const isDark = resolvedTheme === "dark"
    switch (type) {
      case "vegan":
        return isDark ? "/icons/vegan2.png" : "/icons/vegan.png"
      case "vegetarian":
        return isDark ? "/icons/vegetarian2.png" : "/icons/vegetarian.png"
      case "spicy":
        return isDark ? "/icons/spicy2.png" : "/icons/spicy.png"
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-20" 
         style={{ backgroundColor: "var(--background)", color: "var(--color)" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        
        <Link href="/">
          {mounted && (
            <Image
              src={resolvedTheme === "dark" ? "/icons/restaurant2.png" : "/icons/restaurant.png"}
              alt="Leaf icon"
              width={40}
              height={40}
              className="cursor-pointer"
            />
          )}
        </Link>

        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">CookBook</h1>

          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-1"
            >
              <Image
                src={resolvedTheme === "dark" ? "/icons/sun.png" : "/icons/moon.png"}
                alt="Toggle theme"
                width={24}
                height={24}
              />
            </button>
          )}
        </div>
      </div>

      <h2 className="text-6xl font-bold mb-10 text-center">Recipes</h2>

      {/* Search bar */}
      <div className="flex justify-center mb-10 px-4 sm:px-10 md:px-20">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded-full px-10 py-2"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--color)",
              borderColor: "var(--color)"
            }}
          />
          <FaSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: "var(--color)" }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6 max-w-6xl mx-auto">
        
        <div className="flex gap-4 justify-center md:justify-start">
          {["Easy", "Medium", "Hard"].map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(difficulty === level ? "" : level)}
              className="px-3 py-1 rounded-full border"
              style={{
                backgroundColor: difficulty === level ? "var(--color)" : "transparent",
                color: difficulty === level ? "var(--background)" : "var(--color)",
                borderColor: "var(--color)"
              }}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-center md:justify-end">
          {["Spicy", "Vegetarian", "Vegan"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(filter === f ? "" : f)}
              className="px-3 py-1 rounded-full border"
              style={{
                backgroundColor: filter === f ? "var(--color)" : "transparent",
                color: filter === f ? "var(--background)" : "var(--color)",
                borderColor: "var(--color)"
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-8">
        {filtered.map(recipe => (
          <Link
            key={recipe._id}
            href={`/recipes/${recipe.slug.current}`}
            className="border-1 p-5 transition-transform duration-150 transform hover:scale-105"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--color)",
              borderColor: "var(--color)",
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
              {recipe.image && (
                <Image
                  src={urlFor(recipe.image).width(400).height(400).url()}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Info */}
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold mb-2">{recipe.title}</h3>
              <p className="text-sm mb-2" style={{ color: "var(--color)" }}>
                {recipe.category}
              </p>

              {/* Icons */}
              <div className="flex gap-2 justify-center flex-wrap text-xs">
                {recipe.isVegan && (
                  <Image src={getIcon("vegan")!} alt="Vegan" width={20} height={20} />
                )}
                {recipe.isVegetarian && (
                  <Image src={getIcon("vegetarian")!} alt="Vegetarian" width={20} height={20} />
                )}
                {recipe.isSpicy && (
                  <Image src={getIcon("spicy")!} alt="Spicy" width={20} height={20} />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Divider line at bottom */}
      <div className="w-full mt-15" style={{ height: "1px", backgroundColor: "var(--color)" }} />
    </div>
  )
}
