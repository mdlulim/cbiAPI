const axios = require('axios');
const emailHandler = require('../helpers/emailHandler');
const userService = require('../services/User');
const batchTransaction = require('../services/BatchTransaction');
const csv = require('csv-parser')
const fs = require('fs');
const { fileURLToPath } = require('url');
const path = require('path');
const csvParser = require('csv-parser');
var Readable = require('stream').Readable
const results = [];

async function process(req, res) {
    try {
        const fileStatus = await batchTransaction.showFile(req.body.id);
        console.log(fileStatus.dataValues)
        // if(fileStatus.dataValues.file_status === 'Completed'){
        //     return res.send({ success: false, message:'This file has already been processed' })
        // }
        let count =0
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
            //console.log(results.count)
             //const objs = JSON.parse(results)
             count = results.length
             results.forEach(function(transact, index) {
                  let data = {
                    txid: transact.TX_ID,
                    referral_id: transact.REFERRAL,
                    subtype: transact.TYPE,
                    amount: transact.AMOUNT,
                    status: transact.STATUS
                  }
                   userService.process(data).then(res => {
                       console.log(res)
                  });
                  if(count-1 === index){
                      const data = {status: 'Completed'};
                     // console.log(req.body.id)
                        userService.updateBatchStatus(req.body.id,data).then(res => {
                            console.log(res)
                        });
                    return res.send({ success: true, message:'Successfully processed' })
                  }
                // console.log(count-1,index)
             });
           // console.log(transact);
        });
       
        // return res.status(200).send({ success: true });
       
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