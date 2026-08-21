interface SiteConfig {
  title: string;
  description: string;
}

export const siteConfig: SiteConfig = {
  title: "m1nsuppp의 블로그",
  description:
    "프론트엔드 개발자 m1nsuppp의 기술 블로그. 의존성 제어와 테스트 가능한 설계, B2B SaaS 데이터 모델링, Next.js와 React 실무 경험을 기록합니다.",
} as const;
