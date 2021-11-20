const tokenPurchaseConfirmation = data => {
    const {
        amount,
        tokens,
        product,
        first_name,
    } = data;
    const html = `
        <p>Hi ${first_name},</p>
        <p>
            This is to confirm that you have bought ${tokens} ${product.title} for ${amount} ${product.currency.code}
        <p>
        <p>If this request wasn't made by you, contact support urgently.</p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    `;
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
        <p>Hi ${first_name},</p>
        <p>
            This is to confirm that you have subscribed to a Wealth Creator Membership.
        <p>
        <p>If this request wasn't made by you, contact support urgently.</p>
        <p style="padding-top:15px"><strong>Regards</strong>,<br />CBI Support</p>
    `;
    const text = ``;
    return {
        html,
        text
    }
};

module.exports = {
    tokenPurchaseConfirmation,
    wealthCreatorConfirmation,
};