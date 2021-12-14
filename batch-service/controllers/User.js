const axios = require('axios');
const emailHandler = require('../helpers/emailHandler');
const userService = require('../services/User');
const csv = require('csv-parser')
const fs = require('fs');
const { fileURLToPath } = require('url');
const results = [];

async function process(req, res) {
    try {
        //get the file from S3 bucket
        const file = await axios({
            mode: 'no-cors',
            method: 'GET',
            url: req.body.url,
            crossdomain: true,
        })


        fs.createReadStream(new Blob(file)).pipe(csv()).on('data', (data) => results.push(data)).on('end', () => {
            
            // results.forEach(function(transaction) {
            //     //var tableName = table.name;
            //     //console.log(tableName);
            // });


                console.log(results);
            });

        console.log("got file ")


        //convert the file to json object


        //update transactions on db
        // await userService.process(data);

        /**
         * send email notification status
         */


        /**
         * return result to caller
         */
        // return res.status(200).send({ success: true });
        return res.send({ file: "9usdf" })

    } catch (err) {
        console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            console.log(err.errors[0].ValidationErrorItem);
            return res.status(403).send({
                success: false,
                message: `Validation error.`
            });
        }
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function status(req, res) {
    try {
        return userService.status(req.query)
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


module.exports = {
    process,
    status,
}
