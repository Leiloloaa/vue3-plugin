// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      preserveEntrySignatures: 'strict', // 修改这里
      external: ['vue', 'vant'],
      input: ['src/index.ts'],
      output: [
        // esm
        {
          format: 'es',
          dir: 'es',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: 'src'
        },
        // cjs
        {
          format: 'cjs',
          dir: 'lib',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: 'src'
        }
      ]
    }
  },
});
