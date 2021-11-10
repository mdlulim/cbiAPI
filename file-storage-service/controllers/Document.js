const fileUploadService = require('../services/FileUpload');

async function index(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function upload(req, res) {
    try {
        const response = await fileUploadService.uploader(req, res);
        return res.send({
            success: true,
            data: response,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    index,
    upload,
}
