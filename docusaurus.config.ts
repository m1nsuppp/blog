import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { siteConfig } from './src/lib/config/site.config';

const config: Config = {
  title: siteConfig.title,
  tagline: siteConfig.description,
  favicon: 'img/favicon.ico',
  url: 'https://m1nsuplee.vercel.app',
  baseUrl: '/',
  organizationName: 'm1nsuplee',
  projectName: 'm1nsuplee의 블로그',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },
  presets: [
    [
      'classic',
      {
        docs: false, // Optional: disable the docs plugin
        blog: {
          routeBasePath: '/', // Serve the blog at the site's root
          blogSidebarTitle: '최근 작성한 글',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: './src/styles/globals.css',
        },
      },
    ],
  ],
  themeConfig: {
    image: 'img/m1nsuplee-card.png',
    metadata: [
      {
        name: 'google-site-verification',
        content: 'NbB2lZ4_61PvGarA92ve8GkzLdoM5DRiU4288ys_GR8',
      },
    ],
    navbar: {
      title: siteConfig.title,
      logo: {
        alt: siteConfig.title,
        src: 'img/logo.png',
      },
      items: [
        {
          href: 'https://github.com/m1nsuplee',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
