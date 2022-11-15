import { defineUserConfig } from '@vuepress/cli';
import theme from './theme.js';

const base = <'/' | `/${string}/`>process.env.BASE || '/';

export default defineUserConfig({
  base,

  dest: './dist',

  locales: {
    '/': {
      lang: 'en-US',
      title: '모의해킹 진단 가이드',
      description: '모의해킹 진단 가이드',
    },
  },

  theme,

  shouldPrefetch: false,
});
