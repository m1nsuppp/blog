export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: {
    github: string;
  };
  author: string;
};

export type NavItem = {
  title: string;
  href: string;
};
