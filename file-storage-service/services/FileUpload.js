// Load dependencies
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { digitalocean } = require('../config');

const { settings, s3 } = digitalocean;
const { endpoint, accessKeyId, secretAccessKey } = settings;
const { bucket } = s3;

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint(endpoint);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId,
    secretAccessKey
});

// Change bucket property to your Space name
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket,
        acl: 'private', // do not use "public-read"
        key: function (request, file, cb) {
            console.log(file);
            cb(null, `pop/${file.originalname}`);
        }
    })
}).array('upload', 1);

async function uploader(request, response) {
    try {
        return upload(request, response, function (error) {
            if (error) {
                throw new Error('Could not process your request');
            }
            console.log('File uploaded successfully.');
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    uploader,
}
