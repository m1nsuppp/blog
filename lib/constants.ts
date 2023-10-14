type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: {
    github: string;
  };
  author: string;
};

export const siteConfig: SiteConfig = {
  name: '바보같이 해',
  description: '웹 개발에 대해 다루는 공간입니다.',
  url: 'https://like-a-fool.xyz',
  links: {
    github: 'https://github.com/m1nsuplee',
  },
  author: 'm1nsuplee',
};
