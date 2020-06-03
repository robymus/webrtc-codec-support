module.exports = {
  server: {
    command: "webpack-dev-server"
  },
  launch: {
    headless: false,
    args: [ "--use-fake-ui-for-media-stream" ]
  }
};