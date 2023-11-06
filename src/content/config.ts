import { defineCollection } from 'astro:content'

const aboutCollection = defineCollection({
  type: 'content'
})

export const collections = {
  about: aboutCollection
}
