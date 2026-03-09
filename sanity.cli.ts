/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'onxd36ek',
    dataset: 'production'
  },
  deployment: {
    appId: 'n7my6h1bkqjp66xs96t9q7kw'
  }
})
