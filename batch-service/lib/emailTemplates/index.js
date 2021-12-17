const config = require('../../config');
const { baseurl } = config;
const { frontend } = baseurl;

const batchEmail = data => {
    const {
        status,
        filename,
        time

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
                </p>
                <h2 style="text-align: center;">Batch Processing {status}</h2>
            </div>
            <div style="margin: 0 5%; border-bottom: 1px solid grey;">
                <!-- Email body -->
                <div >
                    <p>
                        ${status==='successful'?filename + ' has succefully completed.': filename + ' has failed, below are the processing details.'}
                    <p>
                    <table>
                        <tr>
                            <td>Filename:</td>
                            <td>$(filename)</td>
                        </tr>
                        <tr>
                            <td>Time:</td>
                            <td>${time}</td>
                        </tr>
                        <tr>
                            <td>Status:</td>
                            <td>${status}</td>
                        </tr>
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
    
    </html>
    `;
    const text = `
        Hi Support, 
        ${status==='successful'?filename + ' has succefully completed.': filename + ' has failed, below are the processing details.'}
        Cheers, CBI Support
    `;
    return {
        html,
        text
    }
};

module.exports = {
    batchEmail,
};