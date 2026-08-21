import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { siteConfig } from "./src/lib/config/site.config";

const config: Config = {
  title: siteConfig.title,
  tagline: siteConfig.description,
  favicon: "img/favicon.ico",
  url: "https://blog.m1nsuppp.com",
  baseUrl: "/",
  organizationName: "m1nsuppp",
  projectName: "m1nsuppp의 블로그",
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  i18n: {
    defaultLocale: "ko",
    locales: ["ko"],
  },
  presets: [
    [
      "classic",
      {
        docs: false, // Optional: disable the docs plugin
        gtag: {
          trackingID: "G-XE26X99BE5",
          anonymizeIP: true,
        },
        blog: {
          routeBasePath: "/", // Serve the blog at the site's root
          blogSidebarTitle: "최근 작성한 글",
          blogSidebarCount: 3,
          // routeBasePath가 "/"라 목록 페이지가 곧 홈이다.
          // 지정하지 않으면 플러그인 기본값 "Blog"가 홈의 description이 된다.
          blogTitle: siteConfig.title,
          blogDescription: siteConfig.description,
        },
        theme: {
          customCss: "./src/styles/globals.css",
        },
        sitemap: {
          lastmod: "date",
          changefreq: "weekly",
          priority: 0.5,
          // 글 1편을 그대로 복제하는 얇은 페이지들은 색인 대상에서 제외한다.
          ignorePatterns: ["/tags/**", "/archive", "/authors/**", "/page/**"],
        },
      },
    ],
  ],
  themeConfig: {
    image: "img/og-blog.webp",
    metadata: [
      {
        name: "google-site-verification",
        content: "PycweR-TE8tOh_gy8RYdiNJZOoe5Vb4qpoHnT4yq4OY",
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
        {
          href: "https://blog.m1nsuppp.com/rss.xml",
          label: "RSS",
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
