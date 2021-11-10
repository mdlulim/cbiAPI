const tokenPurchaseConfirmation = data => {
    const {
        tokens,
        product,
        currency,
        first_name,
    } = data;
    const html = `
        <p>Hi ${first_name},</p>
        <p>
            This is to confirm that you have bought ${tokens} ${product.title} for ${amount} ${currency.code}
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
};