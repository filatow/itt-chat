const generate = require('videojs-generate-rollup-config');

// see https://github.com/videojs/videojs-generate-rollup-config
// for options
const options = {
  babel(defaults) {
    defaults.babelrc = true;

    return defaults;
  }
};
const config = generate(options);

// Add additional builds/customization here!

// export the builds to rollup
export default Object.values(config.builds);
