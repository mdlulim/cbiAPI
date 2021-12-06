const config = require('../../config');
const { baseurl } = config;
const { frontend } = baseurl;

const welcome = data => {
    const {
        url,
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
                <div style="margin: 0 5%;">
                    <div style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f); color: white; ">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                        </div>
                        <!-- Email topic -->
                        <p style="line-height: 2; text-align: center;">
                            Hi ${first_name}, </br />
                        </p>
                        <h2 style="text-align: center;">Welcome to the CBI Team!!</h2>
                    </div>
                    <!-- Greetings and short message -->
        
                    <!-- Email body -->
                    <div>
                        <p>
                            Your account has been successfully setup, you can now proceed<br />
                        <p>
                        <a href="${url}" target="_blank" rel="noopener noreferrer">
                            <button
                                style="background-image: linear-gradient(310deg,#c89623,#c89623); color: white; padding: 15px; border: none; cursor: pointer;">
                                Dashboard
                            </button>
                        </a><br/><br/>
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
        
        </html>
    `;
    const text = ``;
    return {
        html,
        text
    }
};

const resetPassword = data => {
    const {
        link,
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
                <div style="margin: 0 5%;">
                    <div style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f); color: white; ">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                        </div>
                        <!-- Email topic -->
                        <p style="line-height: 2; text-align: center;">
                            Hi ${first_name}, </br />
                        </p>
                        <h2 style="text-align: center;">Forgot Password</h2>
                    </div>
                    <!-- Greetings and short message -->
        
                    <!-- Email body -->
                    <div>
                        <p>
                            You have requested for a password reset.
                        <p>
                        <p>
                            <a href="${link}" target="_blank" rel="noopener noreferrer"><button
                                    style="background-image: linear-gradient(310deg,#c89623,#c89623); color: white; padding: 15px; border: none; cursor: pointer;">Reset
                                    Password</button></a><br /><br />
        
                            If the button doesn't work, use the link below<br />
                            <a href="${link}" target="_blank" style="text-decoration: none;">
                                ${link}
                            </a>
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
        
        </html>
    `;
    const text = ``;
    return {
        html,
        text
    }
};

const changePassword = data => {
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
           <div style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f);color: white;">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                    </div>
                    <!-- Email topic -->
                    <p style="line-height: 2; text-align: center;">
                        Hi ${first_name}, </br />
                    </p>
                    <h2 style="text-align: center;">Change Password</h2>
                </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <p>
                    Your password has been successfully changed.<br />
                </p>
                <p>If this request isn't authorized by you, <a href="mailto:support@cbiglobal.io" style="text-decoration: none;">contact support</a></p>
                <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
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
    
    </html>
    `;
    const text = ``;
    return {
        html,
        text
    }
};

const verifyLogin = data => {
    const {
        code,
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
                <div
                    style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f);color: white;">
                    <div style="text-align: center;">
                        <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="" />
                    </div>
                    <!-- Email topic -->
                    <p style="line-height: 2; text-align: center;">
                        Hi ${first_name}, </br />
                    </p>
                    <h2 style="text-align: center;">Verification Code</h2>
                </div>
                <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                    <!-- Email body -->
                    <div>
                        <p>Your verification code is:</p>
                        <p style="font-size: 2.5em;"><strong>${code}</strong></p>
                        <p>Use this code to sign into your CBI account. CBI will never ask you to share this code with anyone. If you are signing in on web, make sure you are on cbiglobal.io.</p>
        
                        <p>If this request isn't authorized by you, <a href="mailto:support@cbiglobal.io" style="text-decoration: none;">contact
                                support</a></p>
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
        
        </html>
    `;
    const text = `
        Hi ${first_name}, 
        Just checking to be sure you're you.
        Enter the following code into the Verification Code field: ${code}

        If this login attempt was not made by you it means someone visited your account 
        login page from an unrecognized browser. It may be an indication you have been 
        the target of a phishing attempt and might want to consider immediately locking 
        your account, or even moving your funds to a new account. If this wasn't you, 
        urgently contact us on support@cbiglobal.io. 

        Regards, CBI Support
    `;
    return {
        html,
        text
    }
};

const loginNotify = data => {
    const {
        os,
        url,
        browser,
        first_name,
        ipaddress,
        location,
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
                <div style="text-align: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="" />
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">Login Attempt</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div>
                    <p>We detected a sign-in to your CBI Global account from a new device or in a new location</a></p>
                    <p>
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>IP:</strong></td>
                                <td>${ipaddress}</td>
                            </tr>
                            <tr>
                                <td><strong>Browser:</strong></td>
                                <td>${browser}</td>
                            </tr>
                            <tr>
                                <td style="padding-right: 40px;"><strong>Operating System:</strong></td>
                                <td>${os}</td>
                            </tr>
                            <tr>
                                <td><strong>Location:</strong></td>
                                <td>${location}</td>
                            </tr>
                        </tbody>
                    </table>

                    </p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
                    <p>
                        Questions? Learn more about <a href="${url}">securing your account</a>.
                    </p>
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

const confirmEmail = data => {
    const {
        link,
        first_name,
    } = data;
    const html = `
        <p>Hi ${first_name},</p>
        <h3>Verify your email address</h3>
        <p>Click the button below to verify your email and continue the sign up process.</p>
        <p><strong>${link}</strong></p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    `;
    const text = `
        Hi ${first_name}, 
        Verify your email address.
        Click the button below to verify your email and continue the sign up process: ${link}.

        Regards, CBI Support
    `;
    return {
        html,
        text
    }
};

const notifyReferrer = data => {
    const {
        first_name,
        referral,
    } = data;
    // const html = `
    //     <p>Hi ${first_name},</p>
    //     <h3>Congratulations. You have a new referral!</h3>
    //     <p>This is to notify you that you have new referral (${referral}) that joined CBI using your referral code/link.</p>
    //     <p>&nbsp;</p>
    //     <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    // `;
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
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="" />
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">New Referral</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div >
                    <p>
                        A new CBI member has signed up using your referral code.<br/>
                    </p>
                    <p><strong>Referral:</strong> ${referral}</p>
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

    </html>`
    const text = ``;
    return {
        html,
        text
    }
};

module.exports = {
    welcome,
    resetPassword,
    changePassword,
    verifyLogin,
    loginNotify,
    confirmEmail,
    notifyReferrer,
};