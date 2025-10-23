import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/slim/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Unit 1 Quizzes - Each skill in its own chunk
          'u1-vocabulary': ['src/store/u1/Vocabulary/vo_01-01.tsx', 'src/store/u1/Vocabulary/vo_01-02.tsx', 'src/store/u1/Vocabulary/vo_01-03.tsx', 'src/store/u1/Vocabulary/vo_01-04.tsx'],
          'u1-grammar': ['src/store/u1/Grammar/gr_01-01.tsx', 'src/store/u1/Grammar/gr_01-02.tsx', 'src/store/u1/Grammar/gr_01-03.tsx', 'src/store/u1/Grammar/gr_01-04.tsx'],
          'u1-reading': ['src/store/u1/Reading/re_01-01.tsx', 'src/store/u1/Reading/re_01-02.tsx'],
          'u1-speaking': ['src/store/u1/Speaking/sp_01-01.tsx'],
          'u1-listening': ['src/store/u1/Listening/li_01-01.tsx'],

          // Unit 2 Quizzes - Each in its own chunk
          'u2-vocabulary': ['src/store/u2/Vocabulary/vo_02-01.tsx', 'src/store/u2/Vocabulary/vo_02-02.tsx', 'src/store/u2/Vocabulary/vo_02-03.tsx', 'src/store/u2/Vocabulary/vo_02-04.tsx'],
          'u2-grammar': ['src/store/u2/Grammar/gr_02-01.tsx', 'src/store/u2/Grammar/gr_02-02.tsx', 'src/store/u2/Grammar/gr_02-03.tsx', 'src/store/u2/Grammar/gr_02-04.tsx'],
          'u2-reading': ['src/store/u2/Reading/re_02-01.tsx', 'src/store/u2/Reading/re_02-02.tsx', 'src/store/u2/Reading/re_02-03.tsx', 'src/store/u2/Reading/re_02-04.tsx'],
          'u2-speaking': ['src/store/u2/Speaking/sp_02-01.tsx', 'src/store/u2/Speaking/sp_02-02.tsx', 'src/store/u2/Speaking/sp_02-03.tsx', 'src/store/u2/Speaking/sp_02-04.tsx'],
          'u2-listening': ['src/store/u2/Listening/li_02-01.tsx', 'src/store/u2/Listening/li_02-02.tsx', 'src/store/u2/Listening/li_02-03.tsx', 'src/store/u2/Listening/li_02-04.tsx'],
        },
      },
    },
  },
});