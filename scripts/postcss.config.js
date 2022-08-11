// const generate = require('videojs-generate-postcss-config');
const generate = require('./itt-chat-postcss-config');

module.exports = function(context) {
  const result = generate(context, {});

  // do custom stuff here

  return result;
};
