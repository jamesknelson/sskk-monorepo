import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

import createAppConfig from '@letterhouse/tool-vite-app-config'

const projectRootDir = resolve(dirname(fileURLToPath(import.meta.url)))

export default defineConfig(createAppConfig({ projectRootDir }))
