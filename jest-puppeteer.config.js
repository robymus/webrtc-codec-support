module.exports = {
  server: {
    command: "webpack-dev-server"
  },
  launch: {
    headless: true,
    args: [ "--use-fake-ui-for-media-stream" ]
  }
};