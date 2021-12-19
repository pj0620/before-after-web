export const enum Environment {
    LOCAL,
    PROD
}

export const Constants = {
  BASE_URL: 'https://api.progresspicsearch.com',
  // BASE_URL: 'http://localhost:3000',
  POSTS: '/posts',
  COMMENTS: '/comments',
  INFINITE_SCROLL: true,
  AD_PROB: 0,
  POSTS_LIMIT: 10,
  ENV: Environment.PROD,
  INCLUDE_SOURCE: true,
  MAX_COMMENT_LENGTH: 250
} as const;
