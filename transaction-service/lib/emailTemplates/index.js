const depositRequestNotification = data => {
    const {
        amount,
        first_name,
        currency_code,
        reference,
    } = data;
    const html = `
        <p>Hi ${first_name},</p>
        <h3>Deposit Request Notification</h3>
        <p>
            This is to confirm a deposit of ${amount} ${currency_code} into your CBI Global wallet. 
            Once this transaction has been verified and approved, you will be notified. Your transaction
            reference number is <strong>${reference}</strong>.
        </p>
        <p>If you don't recognize this activity, please contact us immediately at <a href="mailto:support@cbiglobal.io">support@cbiglobal.io</a>.</p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    `;
    const text = `
        Hi ${first_name}, 
        .
        This is to confirm a deposit of ${amount} ${currency_code} into your CBI Global wallet. 
        Once this transaction has been verified and approved, you will be notified.
        Your transaction reference number is ${reference}.
        If you don't recognize this activity, please contact us immediately at support@cbiglobal.io.
        Regards, CBI Support
    `;
    return {
        html,
        text
    }
};

module.exports = {
    depositRequestNotification,
};