export const enum Environment {
    LOCAL = 'local',
    WEB = 'web',
    IOS = 'ios',
    ANDROID = 'android'
};

export const Constants = {
  BASE_URL: 'https://api.progresspicsearch.com',
  // BASE_URL: 'http://localhost:3000',
  POSTS: '/posts',
  COMMENTS: '/comments',
  INFINITE_SCROLL: true,
  AD_PROB: 0,
  // must be a multiple of 3 and 2
  POSTS_LIMIT: 6, 
  ENV: Environment.ANDROID as Environment,
  INCLUDE_SOURCE: true,
  MAX_COMMENT_LENGTH: 250
} as const;
