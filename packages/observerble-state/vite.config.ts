import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { BuildOptions, defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const libName = 'observerble-state'

type PickArrayOption<T> = T extends any[] ? T[number] : T

type Output = BuildOptions['rollupOptions']['output']
type OutputOptions = PickArrayOption<Output>

// eslint-disable-next-line @typescript-eslint/ban-types
type T1 = Extract<OutputOptions['entryFileNames'], Function>

type PreRenderedChunk = Parameters<T1>[0]

const entryFileNames = (
  format: OutputOptions['format'],
  chunkInfo: PreRenderedChunk,
) => {
  if (chunkInfo.isEntry) {
    // console.log('chunkInfo', JSON.stringify(chunkInfo))
    return format === 'umd' ? `${libName}.umd.js` : `${libName}.js`
  }
  return '[name].js'
}

const build: BuildOptions = {
  lib: {
    entry: resolve(__dirname, 'src/lib/index.ts'),
    name: libName,

    // fileName: libName,
    // fileName(format) {
    //   console.log(format, 'format')
    //   const name = libName
    //   if (format === 'umd') {
    //     return `${name}.js`
    //   }
    //   return `${name}.${format}.js`
    // },
  },
  rollupOptions: {
    external: ['react', 'react-dom'],
    output: [
      {
        format: 'es',
        entryFileNames: '[name].js',
        // entryFileNames: entryFileNames.bind(null, 'es'),

        // all the files in {preserveModulesRoot} will be compiled into a separate file
        // and the directory structure consistent with the {preserveModulesRoot}
        preserveModules: true,
        preserveModulesRoot: 'src/lib',
        dir: 'es',
      },
      {
        // for browser
        format: 'umd',
        // entryFileNames: '[name].umd.js',
        entryFileNames: entryFileNames.bind(null, 'umd'),
      },
      {
        format: 'cjs',
        entryFileNames: '[name].js',
        // entryFileNames: entryFileNames.bind(null, 'cjs'),

        preserveModules: true,
        preserveModulesRoot: 'src/lib',
      },
    ],
  },
}

// https://vitejs.dev/config/
export default defineConfig(config => {
  // console.log(config.mode, 'mode')
  return {
    build: config.mode === 'lib' ? build : undefined,
    publicDir: config.mode === 'lib' ? false : 'public',
    plugins: [
      react(),
      dts({
        outputDir: ['./dist', './es'],
        beforeWriteFile(filePath, content) {
          // source files in lib folder will be build & move to dist|es folder
          // so modify the  declares files location to dist|es also
          filePath = filePath.replace(/\/lib/, '')
          // console.log(filePath, filePath.replace(/\/lib/, ''))
          return {
            filePath,
            content,
          }
        },
        // do not copy any *.d.ts (vite-env.d.ts .eg) to outdir
        copyDtsFiles: false,
      }),
    ],
  }
})
