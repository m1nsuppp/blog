import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { siteConfig } from './src/lib/config/site.config';

const config: Config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',
  url: 'https://like-a-fool.xyz',
  baseUrl: '/',
  organizationName: 'm1nsuplee',
  projectName: 'blog',
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
        },
        theme: {
          customCss: './src/styles/globals.css',
        },
      },
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/like-a-fool-social-card.png',
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
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
