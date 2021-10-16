const companyService = require('../services/company');

function getCompanies(req, res){
    companyService.getAll(req.query || {})
    .then(data => res.send(data));
};

function getCompany(req, res){
    companyService.getById(req.params.id)
    .then(data => res.send(data));
};

function updateCompanyProfile(req, res){
    const data = req.body;

    if (data) data.updated = new Date().toISOString();

    companyService.updateProfile(req.user.company, data)
    .then(() => res.send({ success: true }))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

module.exports = {
    getCompanies,
    getCompany,
    updateCompanyProfile,
};
