import { type SchemaTypeDefinition } from 'sanity'
import recipe from './recipe'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [recipe],
}
