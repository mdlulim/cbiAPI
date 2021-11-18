// Load dependencies
const aws = require('aws-sdk');

const { digitalocean } = require('../config');
const { settings } = digitalocean;
const { bucket } = digitalocean.s3;

async function getUrl(Key) {
    try {
        const {
            endpoint,
            accessKeyId,
            secretAccessKey,
        } = settings;
        const spacesEndpoint = new aws.Endpoint(endpoint);
        const s3 = new aws.S3({
            accessKeyId,
            secretAccessKey,
            endpoint: spacesEndpoint,
        });
        return s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process request');
    }
}

module.exports = {
    getUrl,
}
