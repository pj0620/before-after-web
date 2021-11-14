export const enum Environment {
    LOCAL,
    PROD
}

export const Constants = {
  BASE_URL: 'http://localhost:3000/',
  POSTS: '/posts',
  INFINITE_SCROLL: false,
  AD_PROB: 0,
  POSTS_LIMIT: 10,
  ENV: Environment.PROD,
} as const;
