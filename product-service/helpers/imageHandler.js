const AWS    = require('aws-sdk');
const sharp  = require('sharp');
const config = require('../config');

// AWS instantiation
const s3 = new AWS.S3(config.aws.config);

const resize = async (uri, width, height = 250, format = 'jpg') => {
    try {
        const params = {
            Bucket: config.aws.s3.devices,
            Key: `images/${uri}`
        };
        const origimage = await s3.getObject(params).promise();
        const buffer = await sharp(origimage.Body).resize(width).toBuffer();
        return {
            image: { buffer },
            contentType: 'image/jpeg'
        };

    } catch (error) {
        throw error;
    } 
};

module.exports = {
    resize
};
