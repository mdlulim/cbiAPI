const fileAccessorService = require('../services/FileAccessor');
const fileUploadService = require('../services/FileUpload');

async function upload(request, response) {
    try {
        return fileUploadService.uploader(request, response);

    } catch (error) {
        console.log(error.message || null)
        return response.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function batch_upload(request, response) {
    try {
        return fileUploadService.batch_uploader(request, response);
    } catch (error) {
        console.log(error.message || null)
        return response.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function show(request, response) {
    try {
        const { filename } = request.query;
        if (filename) {
            const url = await fileAccessorService.getUrl(filename);
            return response.send(url);
        }
        return response.status(403).send({
            success: false,
            message: 'Validation error. Filename not specified.'
        });
    } catch (error) {
        console.log(error.message || null)
        return response.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function batch_show(request, response) {
    try {
        const data = await fileAccessorService.getBatchFiles();
        return response.send(data);

    } catch (error) {
        console.log(error.message || null)
        return response.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    upload,
    show,
    batch_show,
    batch_upload,
}
