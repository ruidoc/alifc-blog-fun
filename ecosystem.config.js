module.exports = {
  apps: [
    {
      name: "alifc-blog",
      script: "./index.js",
      env_pro: {
        NODE_ENV: "pro",
      },
      env_test: {
        NODE_ENV: "test",
      },
      env_local: {
        NODE_ENV: "local",
      },
    },
  ],
};
