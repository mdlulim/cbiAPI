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
        <p>Hi ${first_name},</p>
        <p>
            We have reviewed your documents and you have qualified for level ${level}.
            
        `
    html += `To increase your withdrawal limit please read the following comments and re-upload 
            ${remaining}`

    html = +`
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