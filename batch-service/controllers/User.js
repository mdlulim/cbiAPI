const axios = require('axios');
const emailHandler = require('../helpers/emailHandler');
const userService = require('../services/User');
const csv = require('csv-parser')
const fs = require('fs');
const { fileURLToPath } = require('url');
const path = require('path');
const csvParser = require('csv-parser');
var Readable = require('stream').Readable
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
        var s = new Readable()
        s.push(file.data)
        s.push(null)
        /**
        *convert the file to json object
        */
        s.pipe(csv()).on('data', (data) => results.push(data)).on('end', () => {
            results.forEach(function(transact) {
                const transaction = userService.showTransaction({txid: transact.txid});
                userService.process(transaction).then(data => {
                    console.log(data)
                });
            });
            console.log(results);
        });
        console.log(results, "+++++++++++++++++++")
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