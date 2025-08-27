"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"
import { getRecipes } from "@/sanity/lib/getRecipes"
import { FaLeaf, FaPepperHot } from "react-icons/fa"

interface Recipe {
  _id: string
  title: string
  slug: { current: string }
  category?: string
  image?: any
  isVegan?: boolean
  isVegetarian?: boolean
  isSpicy?: boolean
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    async function fetchData() {
      const data = await getRecipes()
      setRecipes(data)
    }
    fetchData()
  }, [])

  const filtered = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category ? recipe.category === category : true
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(recipes.map(r => r.category).filter(Boolean)))

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Recipes</h1>

      {/* Search bar */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Recipes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(recipe => (
          <Link key={recipe._id} href={`/recipes/${recipe.slug.current}`} className="border-1  overflow-hidden hover:shadow-lg transition">
            {recipe.image && (
              <Image
                src={urlFor(recipe.image).width(400).height(250).url()}
                alt={recipe.title}
                width={400}
                height={250}
                className="object-cover w-full h-48"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">{recipe.title}</h2>
              <p className="text-sm text-purple-600 mb-2">{recipe.category}</p>
              <div className="flex gap-2 text-xs">
                {recipe.isVegan && (
                  <span className="text-green-600 flex items-center gap-1">
                    <FaLeaf /> Vegan
                  </span>
                )}
                {recipe.isVegetarian && (
                  <span className="text-green-800 flex items-center gap-1">
                    <FaLeaf /> Vegetarian
                  </span>
                )}
                {recipe.isSpicy && (
                  <span className="text-red-600 flex items-center gap-1">
                    <FaPepperHot /> Spicy
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
