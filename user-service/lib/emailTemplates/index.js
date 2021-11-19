const welcome = data => {
    const {
        url,
        password,
        username,
        first_name,
    } = data;
    const html = `
        <p>Hi ${first_name},</p>
        <p>
            You have been registered on CBI. Please use the details below 
            to log in <a href="${url}">here</a>, 
            or you can copy and paste this link in your browser:<br/>
            <a href="${url}" target="_blank">
                ${url}
            </a><br/><br/>
            <strong>Credentials</strong>
            Username: <strong>${username}</strong><br/>
            Password: <strong>${password}</strong><br/>
        <p>
        <p>If this request wasn't made by you, contact support urgently.</p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    `;
    const text = `
        Hi ${first_name}, 
        You have been registered on CBI. Please use the details below 
        to log in at: ${url}. 
        Username: ${username}. 
        Password: ${password}. 
        If this request wasn't made by you, contact support urgently. 
        Regards, CBI Support
    `;
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
        <p>Hi ${first_name},</p>
        <p>You have requested your password to be reset.<p>
        <p>
            In order to reset your password, click 
            <a href="${link}">
                here 
            </a> 
            or you can copy and paste this link in your browser:<br/>
            <a href="${link}" target="_blank">
                ${link}
            </a>
        </p>
        <p>
            This link will be active for 30 minutes.
            If you don't click on it within that time frame, you can resend it later by
            selecting forgot password option from the login screen.
        </p>
        <p>If this request wasn't made by you, contact support urgently.</p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    `;
    const text = `
        Hi ${first_name}, 
        You have requested your password to be reset.
        In order to reset your password, you can copy and paste this link in your browser: ${link}.
        This link will be active for 30 minutes.
        If you don't click on it within that time frame, you can resend it later by
        selecting forgot password option from the login screen.
        If this request wasn't made by you, contact support urgently.
        Regards, CBI Support
    `;
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
        <p>Hi ${first_name},</p>
        <p>Your password has been successfully changed.</p>
        <p>If this request wasn't you, contact support urgently.</p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    `;
    const text = `
        Hi ${first_name}, 
        Your password has been successfully changed. 
        If this request wasn't you, contact support urgently. 
        Regards, CBI Support
    `;
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
        <p>Hi ${first_name},</p>
        <p><strong>Just checking to be sure you're you.</strong></p>
        <p>Enter the following code into the Verification Code field.</p>
        <p><strong>${code}</strong></p>
        <p>
            If this login attempt was not made by you it means someone visited your account 
            login page from an unrecognized browser. It may be an indication you have been 
            the target of a phishing attempt and might want to consider immediately locking 
            your account, or even moving your funds to a new account. If this wasn't you, 
            urgently contact us on <a href="mailto:support@cbiglobal.io">support@cbiglobal.io</a>.
        </p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
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
        <p>Hi ${first_name},</p>
        <p>We noticed a recent sign-in to your account using ${browser} on ${os} from ${location} (IP: ${ipaddress}).</p>
        <p>
            Don't recognise this activity?<br/>
            Contact support urgently to lock your account.
        </p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
        <p>
            Questions? Learn more about <a href="${url}">securing your account</a>.
        </p>
    `;
    const text = `
        Hi ${first_name}, 
        We noticed a recent sign-in to your account using ${browser} on ${os} from ${location} (IP: ${ipaddress}).
        Don't recognise this activity?
        Regards, CBI Support 
        Questions? Learn more about securing your account on ${url}.
    `;
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

const autoRenewStatusChange = data => {
    const {
        status,
        first_name,
    } = data;
    // const html = `
    //     <p>Hi ${first_name},</p>
    //     <h3>Your Profile has been successfully updated!</h3>
    //     <p>This is notify you that your Wealth Creator Auto-Renew Status has been updated to <strong>${status}</strong></p>
    //     <p>
    //         If this attempt was not made by you it means someone visited your account. 
    //         It may be an indication you have been 
    //         the target of a phishing attempt and might want to consider immediately locking 
    //         your account, or even moving your funds to a new account. If this wasn't you, 
    //         urgently contact us on <a href="mailto:support@cbiglobal.io">support@cbiglobal.io</a>.
    //     </p>
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
            <div style="padding: 20px 0; margin-bottom: 20px; background-image: linear-gradient(310deg,#141727,#3a416f); color: white; ">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="https://cdn-cbigold.ams3.digitaloceanspaces.com/public/email/CDC3837FF1DF9ADC1FF459D0278FD.png" style="height: 50px;" alt="">
                </div>
                <!-- Email topic -->
                <p style="line-height: 2; text-align: center;">
                    Hi ${first_name}, </br />
                </p>
                <h2 style="text-align: center;">WC Auto Renewal</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div>
                    <p>
                    <p>Your Wealth Creator Auto-Renew Status has been changed to:
                        <strong>${status}</strong>
                    </p>
                    <p>If this request isn't authorized by you, <a href="mailto:support@cbiglobal.io" style="text-decoration: none;">contact
                            support</a></p>
                    <p style="padding-top:50px"><strong>Cheers</strong>,<br />CBI Support</p>
                    </p>
                </div>

            </div>
            <!-- Email footer -->
            <div>
                <p style="text-align: center; line-height: 1.5; font-size: smaller;">
                                &copy;2021 CBI Global<br/>
                    <a href="https://demo.cbiglobal.io">Help Centre</a>   |   <a href="https://demo.cbiglobal.io">Terms and conditions</a>   |   <a href="https://demo.cbiglobal.io">Security and privacy</a>
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

const kycNotification = data => {
    const {
        first_name,
        remaining,
        level
    } = data;
    const html = `
        <p>Hi ${first_name},</p>
        <p>
            We have reviewed your documents and you have qualified for level ${level}.
            To increase your withdrawal limit please re-upload the following documents 
            [${remaining}]
        <p>
        <p>If this request wasn't made by you, contact support urgently.</p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    `;
    const text = `
        Hi ${first_name}, 
        We have reviewed your documents and you have qualified for level ${level}
        You have been registered on CBI.
        If this request wasn't made by you, contact support urgently. 
        Regards, CBI Support
    `;
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
    autoRenewStatusChange,
    kycNotification
};