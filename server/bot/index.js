const { VK, Upload } = require('vk-io');
require('dotenv').config();

const vk = new VK({
    token: process.env.BOT_TOKEN,
});

const upload = new Upload({
    api: vk.api,
    uploadTimeout: 1800000,
})

module.exports = vk, { upload }
