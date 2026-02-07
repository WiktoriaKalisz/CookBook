import { notFound } from 'next/navigation'
import { getRecipe } from '@/sanity/lib/getRecipe'
import RecipeDetails from './RecipeDetails'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const recipe = await getRecipe(slug)


  if (!recipe) {
    notFound()
  }

  return <RecipeDetails recipe={recipe} />
}
