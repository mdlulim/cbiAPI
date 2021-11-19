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
                        ${(level+'' ==='-1')? 'You have not qualified for any KYC Level' : 'You have qualified for KYC level <strong>'+level+'strong>.<br/>'}
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
                    <a href="">Help Centre</a>   |   <a href="">Terms and conditions</a>   |   <a href="">Security and privacy</a>
                </p>
            </div>
        </div>
    </body>
    
    </html>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    <p>Hi ${first_name},</p>
        <p>
            We have reviewed your documents and you have qualified for level ${level}.
            
            ${(level+'' !=='3')? 'To increase your withdrawal limit please read the following comments and re-upload ' + remaining : ''}
        <p>
        <p>If this request wasn't made by you, contact support urgently.</p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    `;
    const text = `
        Hi ${first_name}, 
        We have reviewed your documents and you have qualified for level ${level}
        If this request wasn't made by you, contact support urgently. 
        Regards, CBI Support
    `;
    return {
        html,
        text
    }
};

module.exports = {
    newUser,
    kycNotification
};