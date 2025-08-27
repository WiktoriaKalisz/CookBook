import { client } from './client'

export async function getRecipes() {
  const query = `
    *[_type == "recipe"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      category,
      image,
      isVegan,
      isVegetarian,
      difficulty,
      isSpicy
    }
  `
  return await client.fetch(query)
}
