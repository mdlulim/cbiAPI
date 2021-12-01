const activityService = require('../services/Activity');
const addressService = require('../services/Address');

async function create(req, res) {
    try {
        const data = req.body;
        data.user_id = req.user.id;
        const address = await addressService.create(data);

        // log activity
        await activityService.add({
            user_id: req.user.id,
            action: `${req.user.group_name.toLowerCase()}.address.add`,
            description: `${req.user.first_name} captured profile address`,
            section: 'Profile/KYC',
            subsection: 'Address',
            data: address,
            ip: null,
        });

        return res.send({
            success: true,
            data: address,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function index(req, res) {
    try {
        const addresses = await addressService.index(req.user.id);
        const { count, rows } = addresses;
        return res.send({
            success: true,
            data: {
                count,
                results: rows,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function show(req, res) {
    try {
        const address = await addressService.show(req.params.id);
        return res.send({
            success: true,
            data: address,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function update(req, res) {
    try {
        await addressService.update(req.params.id, req.body);

        // log activity
        await activityService.add({
            user_id: req.user.id,
            action: `${req.user.group_name.toLowerCase()}.address.update`,
            description: `${req.user.first_name} updated profile address`,
            section: 'Profile/KYC',
            subsection: 'Address',
            data: req.body,
            ip: null,
        });

        return res.send({
            success: false,
            message: err.message,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function destroy(req, res) {
    try {
        return addressService.destroy(req.params.id)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
};
