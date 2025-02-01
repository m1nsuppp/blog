import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { siteConfig } from "./src/lib/config/site.config";

const config: Config = {
  title: siteConfig.title,
  tagline: siteConfig.description,
  favicon: "img/favicon.ico",
  url: "https://m1nsuppp.vercel.app",
  baseUrl: "/",
  organizationName: "m1nsuppp",
  projectName: "m1nsuppp의 블로그",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "ko",
    locales: ["ko"],
  },
  presets: [
    [
      "classic",
      {
        docs: false, // Optional: disable the docs plugin
        blog: {
          routeBasePath: "/", // Serve the blog at the site's root
          blogSidebarTitle: "최근 작성한 글",
          blogSidebarCount: 3,
        },
        theme: {
          customCss: "./src/styles/globals.css",
        },
      },
    ],
  ],
  themeConfig: {
    image: "img/m1nsuppp-card.png",
    metadata: [
      {
        name: "google-site-verification",
        content: "NbB2lZ4_61PvGarA92ve8GkzLdoM5DRiU4288ys_GR8",
      },
    ],
    navbar: {
      title: siteConfig.title,
      logo: {
        alt: siteConfig.title,
        src: "img/logo.png",
      },
      items: [
        {
          href: "https://github.com/m1nsuppp",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    colorMode: {
      defaultMode: "dark",
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
