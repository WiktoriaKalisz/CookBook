import { client } from './client'

export async function getRecipe(slug: string) {
    const query = `
    *[_type == "recipe" && slug.current == $slug][0] {
      title,
      slug,
      image,           
      prepTime,
      cookTime,        
      difficulty,
      isVegan,
      isVegetarian,
      isSpicy,
      ingredients,
      instructions,
      description,
      servings
    }
  `
  return await client.fetch(query, { slug })
}
