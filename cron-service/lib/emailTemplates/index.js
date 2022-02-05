const moment = require('moment');
const config = require('../../config');
const { baseurl } = config;
const { frontend } = baseurl;

const autoRenewExpiryNotify = data => {
    const {
        expiry,
        first_name,
    } = data;
    const html = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>

    <body>
        <div style="
                font-family: Arial, Helvetica, sans-serif; 
                color: darkslategray; 
                min-width: 360px; 
                max-width: 600px; 
                margin: 0 auto;
                line-height: 1.5;">
            <div style="padding: 20px 0; margin-bottom: 20px; background-color: #2D3357;  background-image: linear-gradient(310deg,#141727,#3a416f);  color: white; ">
                <div style="align-items: center; text-align: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" height="50px" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, <br />
                </p>
                <h2 style="text-align: center;">Wealth Creator Membership Expires Soon</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div>
                    <p>
                    <p>
                        Your Wealth Creator membership will be expiring on ${moment(expiry).format('DD MMMM YYYY')}. Prevent this
                        by updating your auto-renewal status to ON before the expiry date, otherwise
                        you will lose all Wealth Creator member benefits.
                    </p>
                    <p>To update your status, please visit your account at <a href="${frontend}/account" style="text-decoration: none;">${frontend}/account</a></p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
                    </p>
                </div>

            </div>
            <!-- Email footer -->
            <div>
                <p style="text-align: center; line-height: 1.5; font-size: smaller;">
                                &copy;2021 CBI Global<br/>
                    <a href="${frontend}">Help Centre</a>   |   <a href="${frontend}">Terms and conditions</a>   |   <a href="${frontend}">Security and privacy</a>
                </p>
            </div>
        </div>
    </body>

    </html>`;
    const text = ``;
    return {
        html,
        text
    }
};

const autoRenewNotify = data => {
    const {
        expiry,
        first_name,
        amount,
    } = data;
    const html = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>

    <body>
        <div style="
                font-family: Arial, Helvetica, sans-serif; 
                color: darkslategray; 
                min-width: 360px; 
                max-width: 600px; 
                margin: 0 auto;
                line-height: 1.5;">
            <div style="padding: 20px 0; margin-bottom: 20px; background-color: #2D3357;  background-image: linear-gradient(310deg,#141727,#3a416f);  color: white; ">
                <div style="align-items: center; text-align: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" height="50px" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, <br />
                </p>
                <h2 style="text-align: center;">Wealth Creator Renewal Success</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div>
                    <p>
                    <p>
                        Your Wealth Creator Membership has been successfully renewed. We have billed your wallet for the amount of ${amount} CBI (Renewal Fee). 
                        Your next membership expiry date is ${moment(expiry).format('DD MMMM YYYY')}.
                    </p>
                    <p>
                        If your membership is on a 1 month subscription term, it will automatically renew next month at the same price listed here, unless otherwise indicated.
                    </p>
                    <p>
                        To review all your products and/or manage account, sign in to your account at <a href="${frontend}/account" style="text-decoration: none;">${frontend}/account</a>
                    </p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
                    </p>
                </div>

            </div>
            <!-- Email footer -->
            <div>
                <p style="text-align: center; line-height: 1.5; font-size: smaller;">
                                &copy;2021 CBI Global<br/>
                    <a href="${frontend}">Help Centre</a>   |   <a href="${frontend}">Terms and conditions</a>   |   <a href="${frontend}">Security and privacy</a>
                </p>
            </div>
        </div>
    </body>

    </html>`;
    const text = ``;
    return {
        html,
        text
    }
};

module.exports = {
    autoRenewExpiryNotify,
    autoRenewNotify,
};