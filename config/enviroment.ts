const ENV = {
  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID ?? "",
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET ?? "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "",
  NODE_ENV: process.env.NODE_ENV ?? "",
};

export default ENV;
