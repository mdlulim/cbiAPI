const productService = require('../services/Product');
const activityService = require('../services/Activity');

function permakey(title) {
    return title.split(' ')
        .join('-')
        .trim()
        .toLowerCase();
}

async function createCategory(req, res) {
    try {
        const data = req.body;
        await productService.createCategory(data);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.add-category`,
            description: `${req.user.group_name} added a new product category (${data.title})`,
            section: 'Products',
            subsection: 'Add Category',
            ip: null,
            data,
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function create(req, res) {
    try {
        const data = req.body;
        data.captured_by = req.user.id;
        data.permakey = permakey(data.title);
        // check product by unique permakey/code
        const product = await productService.findByPermakey(data.permakey);
        if (product && product.id) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. Same product name already exists'
            });
        }

        await productService.create(data);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.add`,
            description: `${req.user.group_name} added a new product (${data.title})`,
            section: 'Products',
            subsection: 'Add',
            ip: null,
            data,
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function index(req, res) {
    try {
        const products = await productService.index(req.query);
        const { count, rows } = products;
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function history(req, res) {
    try {
        const products = await productService.history(req.query);
        const { count, rows } = products[0];
        console.log(products[0])
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: products[0],
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}



async function cancel(req, res) {
    try {
        const products = await productService.cancel(req.query);
        const { count, rows } = products;

        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function cancelStatus(req, res) {
    try {
        const data = req.body;
        await productService.cancelStatus(data.id, { status: data.status });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function getMembersByProductId(req, res) {
    try {
        const members = await productService.getMembersByProductId(req.params.id);
        console.log(members[0]);
        const { count, rows } = members[0];
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: members[0],
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function show(req, res) {
    try {
        const product = await productService.show(req.params.id);
        console.log(product)
        return res.send({
            success: true,
            data: product
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function showCategory(req, res) {
    try {
        const category = await productService.showCategory(req.params.id);
        return res.send({
            success: true,
            data: category
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function showSubcategory(req, res) {
    try {
        const category = await productService.showSubcategory(req.params.id);
        return res.send({
            success: true,
            data: category
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function update(req, res) {
    try {
        const data = req.body;
        await productService.update(req.params.id, data);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.update`,
            description: `${req.user.group_name} updated a product (${data.title})`,
            section: 'Products',
            subsection: 'Update',
            ip: null,
            data: {
                ...data,
                id: req.params.id,
            },
        });
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

async function updateCategory(req, res) {
    return productService.updateCategory(req.params.id, req.body)
        .then(data => res.send(data))
        .catch(err => {
            console.log(err.message)
            res.send({
                success: false,
                message: err.message,
            });
        });
}

// async function updateSubcategory(req, res) {
//     return productService.updateSubcategory(req.params.id, req.body)
//     .then(data => res.send(data))
//     .catch(err => {
//         console.log(err.message)
//         res.send({
//             success: false,
//             message: err.message,
//         });
//     });
// }

async function updateSubcategory(req, res) {
    try {
        await productService.updateSubcategory(req.params.id, req.body);

        return res.send({
            success: true, message: 'successfully updated'
        });
    } catch (error) {
        return {
            success: false,
            message: 'Could not process request'
        };
    }
}

async function destroy(req, res) {
    try {
        const data = await productService.show(req.params.id);
        await productService.destroy(req.params.id);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.delete`,
            description: `${req.user.group_name} deleted a product (${data.title})`,
            section: 'Products',
            subsection: 'Delete',
            ip: null,
            data,
        });
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

async function categories(req, res) {
    try {
        const categories = await productService.categories(req.query);
        const { count, rows } = categories;
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function getSubcategories(req, res) {
    try {
        const categories = await productService.getSubcategories(req.query);
        const { count, rows } = categories;
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    createCategory,
    create,
    index,
    history,
    show,
    update,
    destroy,
    categories,
    getMembersByProductId,
    categories,
    updateCategory,
    showCategory,
    getSubcategories,
    showSubcategory,
    updateSubcategory,
    cancel,
    cancelStatus
};