import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

const build: UserConfig['build'] = {
  lib: {
    entry: resolve(__dirname, 'src/index.ts'),
    name: 'observerble-state',
    // fileName: (format) => `[name].${format}.js`
    fileName(format) {
      const name = this.name;
      if (format === 'umd') {
        return `${name}.js`
      }
      return  `${name}.${format}.js`
    }
  }
}


// https://vitejs.dev/config/
export default defineConfig(config => {
  // console.log(config.mode, 'mode')
  return {
    build: config.mode === 'lib' ? build: undefined,
    plugins: [react()],
  }
})
