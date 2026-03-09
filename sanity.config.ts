import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Blog',

  projectId: 'onxd36ek',
  dataset: 'production',

  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})


