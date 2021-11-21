export const enum Environment {
    LOCAL,
    PROD
}

export const Constants = {
  BASE_URL: 'https://api.progresspicsearch.com',
  POSTS: '/posts',
  INFINITE_SCROLL: true,
  AD_PROB: 0,
  POSTS_LIMIT: 10,
  ENV: Environment.PROD,
} as const;
