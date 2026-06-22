const ImageKit = require('imagekit');
const config = require('./config');

const imagekit = new ImageKit({
  publicKey: config.imagekit.publicKey,
  privateKey: config.imagekit.privateKey,
  urlEndpoint: config.imagekit.urlEndpoint,
});

module.exports = imagekit;
