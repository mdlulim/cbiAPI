// Handle not found errors
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Requested Resource Not Found (404)'
    }).end();
};

// Handle internal server errors
const error = (err, res) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Request could not be processed'
    }).end();
};

module.exports = {
    notFound,
    error
};
