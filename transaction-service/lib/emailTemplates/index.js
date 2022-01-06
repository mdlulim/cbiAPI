const config = require('../../config');
const { baseurl } = config;
const { frontend } = baseurl;

const depositRequestNotification = data => {
    const {
        amount,
        first_name,
        currency_code,
        reference,
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f);color: white; ">
                <div style="align-items: center; text-align: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">Deposit Confirmation</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div >
                    <p>
                        Your deposit is being processed as follows:<br/>
                    </p>
                    <table>
                        <tbody>
                            <tr>
                                <td style="padding-right: 40px;"><strong>Amount:</strong></td>
                                <td>${amount} ${currency_code}</td>
                            </tr>
                            <tr>
                                <td><strong>Reference:</strong></td>
                                <td>${reference}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>If this request isn't authorized by you, <a href="mailto:support@cbiglobal.io" style="text-decoration: none;">contact support</a></p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
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

const cryptoDepositRequestNotification = data => {
    const {
        first_name,
        base_amount,
        base_currency,
        quote_amount,
        quote_currency,
        reference,
        address,
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f);color: white; ">
                <div style="align-items: center; text-align: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">Pending Deposit Notification</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div>
                    <p>
                        You are one step away from completing your deposit transaction. See transaction details below:<br/>
                    </p>
                    <table>
                        <tbody>
                            <tr>
                                <td style="padding-right: 40px;"><strong>${base_currency} Amount:</strong></td>
                                <td>${base_amount} ${base_currency}</td>
                            </tr>
                            <tr>
                                <td style="padding-right: 40px;"><strong>${quote_currency} Amount:</strong></td>
                                <td>${quote_amount} ${quote_currency}</td>
                            </tr>
                            <tr>
                                <td><strong>Reference:</strong></td>
                                <td>${reference}</td>
                            </tr>
                            <tr>
                                <td valign="top"><strong>Deposit Address:</strong></td>
                                <td valign="top">
                                    <strong>${address}</strong><br/>
                                    Send ${base_amount} ${base_currency} to this address in order to complete this transaction.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p>If this request isn't authorized by you, <a href="mailto:support@cbiglobal.io" style="text-decoration: none;">contact support</a></p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
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

const transferSendNotification = data => {
    const {
        amount,
        first_name,
        currency_code,
        reference,
        recipient,
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f);color: white;">
                <div style="align-items: center; text-align: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">Transfer Completed</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div >
                    <p>
                    Your transfer has been successfully completed.<br/>
                    </p><br/>
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>To:</strong></td>
                                <td>${recipient}</td>
                            </tr>
                            <tr>
                                <td><strong>Reference:</strong></td>
                                <td>${reference}</td>
                            </tr>
                            <tr>
                                <td style="padding-right: 40px;"><strong>Amount:</strong></td>
                                <td>${amount} ${currency_code}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>If this request isn't authorized by you, <a href="mailto:support@cbiglobal.io" style="text-decoration: none;">contact support</a></p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
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

const transferReceiptNotification = data => {
    const {
        amount,
        first_name,
        currency_code,
        sender,
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f);color: white;">
                <div style="align-items: center; text-align: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">Payment Notification</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div >
                    <p>
                    This is to confirm that you received funds into your CBI Global wallet.<br/>
                    </p><br/>
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>From:</strong></td>
                                <td>${sender}</td>
                            </tr>
                            <tr>
                                <td style="padding-right: 40px;"><strong>Amount:</strong></td>
                                <td>${amount} ${currency_code}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
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
    cryptoDepositRequestNotification,
    depositRequestNotification,
    transferSendNotification,
    transferReceiptNotification,
};