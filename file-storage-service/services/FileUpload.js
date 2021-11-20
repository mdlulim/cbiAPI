// Load dependencies
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const documentService = require('../services/Document');
const userService = require('../services/User');

const { digitalocean } = require('../config');
const { settings } = digitalocean;
const { bucket } = digitalocean.s3;

// Set S3 endpoint to DigitalOcean Spaces
const s3 = new aws.S3(settings);

const upload = multer({
    storage: multerS3({
        s3,
        bucket,
        acl: 'public-read-write',
        key: async function (request, file, cb) {
            const { category, type } = request.params;
            const { filename } = request.query;
            const { user } = request;
            const file_name = filename ? `${category}/${type}/${user.id}/${filename}` : `${category}/${type}/${user.id}/${new Date().getTime()}.${file.originalname.split('.')[1]}`;
            // store file path in database
            await documentService.create({
                type,
                category,
                file: file_name,
                user_id: user.id,
            });
            // check if profile image upload
            if (category === 'profile' && type === 'image') {
                // update profile image
                await userService.update({
                    profile: file_name,
                    updated: new Date().toISOString(),
                }, user.id);
            }
            cb(null, file_name);
        },
        size: 104857600
    })
}).array('upload', 1);

async function uploader(request, response, next) {
    try {
        return upload(request, response, function (error) {
            if (error) {
                console.log(error);
                return response.status(403).send({
                    success: false,
                    message: error.message || 'error'
                });
            }
            const data = {
                success: true,
                message: 'File uploaded successfully.',
            };
            if (request.query.filename) {
                const { category, type } = request.params;
                const { user } = request;
                data.filename = `${category}/${type}/${user.id}/${request.query.filename}`;
            }
            return response.status(200).send(data);
        });
    } catch (error) {
        console.log(error.message || null)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    uploader,
}
