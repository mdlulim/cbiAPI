const config = require('../../config');
const { baseurl } = config;
const { frontend } = baseurl;

const newUser = data => {
    const {
        email,
        password,
        first_name,
    } = data;

    const html = `
        <p>Hi ${first_name},</p>
        <p>
            You have been added to CBI as a user. Please use the details below 
            to log in.<br /><br />
            <strong>Credentials:</strong><br />
            Email: <strong>${email}</strong><br />
            Temporary Password: <strong>${password}</strong><br />
        <p>
        <p><strong>Remember to immediately change the password to your own after logging in.</strong></p>
        <p>If this request wasn't made by you, contact support urgently.</p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    `;
    const text = `
        Hi ${first_name}, 
        You have been added to CBI as a user. Please use the details below to log in. 
        Credentials: 
        Email: ${email}. 
        Temporary Password: ${password}. 
        Remember to immediately change the password to your own after logging in.
        If this request wasn't made by you, contact support urgently. 
        Regards, CBI Support
    `;
    return {
        html,
        text
    }


};

const kycNotification = data => {
    const {
        first_name,
        remaining,
        level
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
        <div
            style="
                font-family: Arial, Helvetica, sans-serif; 
                color: darkslategray; 
                min-width: 360px; 
                max-width: 600px; 
                margin: 0 auto;
                line-height: 1.5;">
            <div style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f);color: white;">
                <div style="text-align: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">KYC Application</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div >
                    <p>
                        ${(level+'' ==='-1')? 'You have not qualified for any KYC Level<br/>' : 'You have qualified for KYC level <strong>'+level+'<strong>.<br/>'}
                        ${(level+'' !=='3')? 'Review the comments and re-upload:': ''}
                    <p>
                    ${(level+'' !=='3')? remaining: ''}
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
    
    </html>
    `;
    const text = `
        Hi ${first_name}, 
        ${(level+'' ==='-1')? 'You have not qualified for any KYC Level' : 'You have qualified for KYC level <strong>'+level+'<strong>.<br/>'}
        ${(level+'' !=='3')? 'Please re-upload the rejected documents': ''} 
        Cheers, CBI Support
    `;
    return {
        html,
        text
    }
};

const updatingUserStatus = data => {
    const {
        email,
        status,
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f);color: white; ">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">CBI Membership Status Notification </h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div >
                    <p>
                        Your CBI membership status has been ${status === 'Active'? '<b>Activated</b>': status === 'Blocked' ? '<b>Blocked</b>': 'Archived'}<br/>
                    </p>
                 
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
    const text = ` `;
    return {
        html,
        text
    }


};

const approveMembership = data => {
    const {
        amount,
        first_name,
        currency_code,
        available_balance,
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
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">Welcom to CBI Global </h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div >
                    <p>
                        Your CBI membership has been approved<br/>
                    </p>
                    <table>
                        <tbody>
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

const memberCommissionFee = data => {
    const {
        amount,
        first_name,
        username,
        currency_code,
        available_balance,
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
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">CBI REFERRAL FEE </h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div >
                    <p>
                        Your CBI wallet account has been credited with ${amount} ${currency_code} from your referral<br/>
                    </p>
                    <table>
                        <tbody>
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

const transactionNotification = data => {
    const {
        amount,
        first_name,
        currency_code,
        subtype,
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
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">CBI Transaction Notification </h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div >
                    <p>
                        Your CBI wallet account has been ${subtype} with ${amount} ${currency_code} <br/>
                    </p>
                    <table>
                        <tbody>
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


module.exports = {
    newUser,
    kycNotification,
    approveMembership,
    updatingUserStatus,
    transactionNotification,
    memberCommissionFee
};