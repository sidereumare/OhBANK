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
  
  head:[
    [
      "script",
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-ZGDX716D34",
      }
    ],
    ["script", {}, ["window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-ZGDX716D34');"]],
  ],

  theme,

  shouldPrefetch: false,
});
