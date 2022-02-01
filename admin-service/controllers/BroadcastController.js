const activityService = require('../services/Activity')
const broadcastService = require('../services/Broadcast');

async function index(req, res) {
    try {
        const { rows, count } = await broadcastService.index(req.query);
        return res.send({
            success: true,
            data: {
                results: rows,
            },
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
}

// async function show(req, res) {
//     try {
//         return userService.show(req.params.id)
//             .then(data => res.send(data))
//             .catch(err => {
//                 res.send({
//                     success: false,
//                     message: err.message,
//                 });
//             });
//     } catch (error) {
//         return res.send({
//             success: false,
//             message: 'Could not process request'
//         });
//     }
// }

async function update(req, res) {
    return broadcastService.update(req.params.id, req.body)
        .then(async () => {
            // log activity
            // await activityService.addActivity({
            //     user_id: req.user.id,
            //     action: `${req.user.group_name}.users.update`,
            //     section: 'Users',
            //     subsection: 'Update',
            //     description: `${req.user.first_name} updated admin user record`,
            //     ip: null,
            //     data: req.body,
            // });
            return res.send({ success: true })
        })
        .catch(err => {
            res.send({
                success: false,
                message: 'Could not process your request'
            });
        });
}


async function create(req, res) {
    return broadcastService.create(req.body, req.user)
        .then(async () => {
            // log activity
            // await activityService.addActivity({
            //     user_id: req.user.id,
            //     action: `${req.user.group_name}.users.update`,
            //     section: 'Users',
            //     subsection: 'Update',
            //     description: `${req.user.first_name} updated admin user record`,
            //     ip: null,
            //     data: req.body,
            // });
            return res.send({ success: true })
        })
        .catch(err => {
            res.send({
                success: false,
                message: 'Could not process your request'
            });
        });
}

function audience(req, res) {
    return broadcastService.audience(req.query)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
};

module.exports = {
    index,
    update,
    create,
    audience,
}
