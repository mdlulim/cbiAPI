const activityService = require('../services/Activity');
const settingService = require('../services/Setting');

function permakey(title) {
    return title.split(' ')
        .join('-')
        .trim()
        .toLowerCase();
}

async function create(req, res){
    try{
        const data = req.body;
        data.captured_by = req.user.id;
        data.key = permakey(data.title);
        // check product by unique permakey/code
        const setting = await settingService.findByKey(data.key);
        if (setting && setting.id) {
            return res.send({
                success: false,
                message: 'Validation error. Same setting title already exists'
            });
        }

         settingService.create(data);
         activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.settings.add`,
            description: `${req.user.group_name} added a new settings (${data.title})`,
            section: 'Settings',
            subsection: 'Add',
            ip: null,
            data,
        });
        return res.send({
            success: true,
        });
    }catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
    
};

async function index(req, res) {
    try {
        return settingService.index(req.query)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request 2'
        });
    }
}

async function getSettingCommissions(req, res) {
    try {
        return settingService.getSettingCommissions(req.query)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request 2'
        });
    }
}

async function show(req, res) {
    try {
        return settingService.show(req.params.id)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function update(req, res) {
    try {
        return settingService.update(req.params.id, req.body)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function destroy(req, res) {
    try {
        return settingService.destroy(req.params.id)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    create,
    index,
    getSettingCommissions,
    show,
    update,
    destroy
}
