const config = require('../../config');
const { baseurl } = config;
const { frontend } = baseurl;

const tokenPurchaseConfirmation = data => {
    const {
        amount,
        tokens,
        product,
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-color: #2D3357;  background-image: linear-gradient(310deg,#141727,#3a416f); color: white;">
                <div style="text-align: center">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" height: 50px alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, <br />
                </p>
                <h2 style="text-align: center;">Product purchase</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div>
                    <p>
                        You have successfully purchased ${tokens.toFixed(4)} ${product.title} for ${amount.toFixed(4)} ${product.currency.code}
                    </p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
                </div>
            </div>
            <!-- Email footer -->
            <div>
                <p style="text-align: center; line-height: 1.5; font-size: smaller;">
                    &copy;2021 CBI Global<br />
                    <a href="${frontend}">Help Centre</a> | <a href="${frontend}">Terms and conditions</a> | <a href="${frontend}">Security and privacy</a>
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

const wealthCreatorConfirmation = data => {
    const {
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-color: #2D3357;  background-image: linear-gradient(310deg,#141727,#3a416f); color: white;">
                <div style="text-align: center">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" height: 50px alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, <br />
                </p>
                <h2 style="text-align: center;">Product purchase</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div>
                    <p>
                        This is to confirm that you have subscribed to a Wealth Creator Membership.
                    </p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
                </div>
            </div>
            <!-- Email footer -->
            <div>
                <p style="text-align: center; line-height: 1.5; font-size: smaller;">
                    &copy;2021 CBI Global<br />
                    <a href="${frontend}">Help Centre</a> | <a href="${frontend}">Terms and conditions</a> | <a href="${frontend}">Security and privacy</a>
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

const productPurchaseConfirmation = data => {
    const {
        product,
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-color: #2D3357;  background-image: linear-gradient(310deg,#141727,#3a416f); color: white;">
                <div style="text-align: center">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" height: 50px alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, <br />
                </p>
                <h2 style="text-align: center;">Product purchase</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div>
                    <p>
                        You have successfully purchased ${product.title}.
                    </p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
                </div>
            </div>
            <!-- Email footer -->
            <div>
                <p style="text-align: center; line-height: 1.5; font-size: smaller;">
                    &copy;2021 CBI Global<br />
                    <a href="${frontend}">Help Centre</a> | <a href="${frontend}">Terms and conditions</a> | <a href="${frontend}">Security and privacy</a>
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

const cbiX7SellConfirmation = data => {
    const {
        amount,
        tokens,
        product,
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-color: #2D3357;  background-image: linear-gradient(310deg,#141727,#3a416f); color: white;">
                <div style="text-align: center">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" height: 50px alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, <br />
                </p>
                <h2 style="text-align: center;">CBIx7 Sell Confirmation</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div>
                    <p>
                        You have successfully sold ${tokens} ${product.title.toLowerCase()}. ${amount.toFixed(4)} ${product.currency.code} has been credited 
                        into your CBI wallet.
                    </p>
                    <p>If this request isn't authorized by you, <a href="mailto:support@cbiglobal.io" style="text-decoration: none;">contact support</a></p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
                </div>
            </div>
            <!-- Email footer -->
            <div>
                <p style="text-align: center; line-height: 1.5; font-size: smaller;">
                    &copy;2021 CBI Global<br />
                    <a href="${frontend}">Help Centre</a> | <a href="${frontend}">Terms and conditions</a> | <a href="${frontend}">Security and privacy</a>
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

const cancellationRequestConfirmation = data => {
    const {
        product,
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-color: #2D3357;  background-image: linear-gradient(310deg,#141727,#3a416f); color: white;">
                <div style="text-align: center">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" height: 50px alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, <br />
                </p>
                <h2 style="text-align: center;">Cancellation Request Confirmation</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div>
                    <p>
                        Your cancellation request for ${product.title} has been logged successfully. After 
                        being reviewed, this request may be approved/declined based on 
                        <a href="${frontend}">CBI cancellation terms and conditions</a>, and you should thereafter 
                        received confirmation.
                    </p>
                    <p>If this request isn't authorized by you, <a href="mailto:support@cbiglobal.io" style="text-decoration: none;">contact support</a></p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
                </div>
            </div>
            <!-- Email footer -->
            <div>
                <p style="text-align: center; line-height: 1.5; font-size: smaller;">
                    &copy;2021 CBI Global<br />
                    <a href="${frontend}">Help Centre</a> | <a href="${frontend}">Terms and conditions</a> | <a href="${frontend}">Security and privacy</a>
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
    cbiX7SellConfirmation,
    tokenPurchaseConfirmation,
    wealthCreatorConfirmation,
    productPurchaseConfirmation,
    cancellationRequestConfirmation,
};