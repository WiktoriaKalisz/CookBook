export default {
    name: 'recipe',
    title: 'Recipe',
    type: 'document',
    fields: [
      { 
        name: 'title', 
        title: 'Title', 
        type: 'string' 
      },
      {
        name: 'servings',
        title: 'Servings',
        type: 'number'
      },
      { 
        name: 'slug', 
        title: 'Slug', 
        type: 'slug', 
        options: { source: 'title', maxLength: 96 } 
      },
      { 
        name: 'image',  
        title: 'Image', 
        type: 'image', 
        options: { hotspot: true } 
      },
      { 
        name: 'description', 
        title: 'Description', 
        type: 'text' 
      },
      {
        name: 'prepTime',
        title: 'Prep Time (minutes)',
        type: 'number',
      },
      {
        name: 'cookTime',
        title: 'Cook Time (minutes)',
        type: 'number',
      },
      { 
        name: 'difficulty',  
        title: 'Difficulty', 
        type: 'string', 
        options: {
          list: [
            { title: 'Easy', value: 'easy' },
            { title: 'Medium', value: 'medium' },
            { title: 'Hard', value: 'hard' }
          ],
          layout: 'radio'
        }
      },
      { 
        name: 'isVegan', 
        title: 'Vegan', 
        type: 'boolean' 
      },
      { 
        name: 'isVegetarian', 
        title: 'Vegetarian', 
        type: 'boolean' 
      },
      { 
        name: 'isSpicy', 
        title: 'Spicy', 
        type: 'boolean' 
      },
      {
        name: 'ingredients',
        title: 'Ingredients',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'amount',
                title: 'Amount',
                type: 'number'
              },
              {
                name: 'unit',
                title: 'Unit',
                type: 'string'
              },
              {
                name: 'name',
                title: 'Ingredient Name',
                type: 'string'
              }
            ]
          }
        ]
      },
      { 
        name: 'instructions',
        title: 'Instructions', 
        type: 'array', 
        of: [{ type: 'string' }]
      },
    ]
  }
  