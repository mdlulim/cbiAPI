const sequelize = require('../config/db');
const { KYC } = require('../models/KYC');

async function level(user_id) {
    try {
        const data = await KYC.findAll({
            where: { user_id },
            order: [['created', 'DESC']],
        });
        
        let leastRejected = 10;
        let totalVerified = 0;

        data.map(item => {
            if ((parseInt(item.level) < leastRejected && item.status.toUpperCase() === 'REJECTED') || 
                (parseInt(item.level) < leastRejected && item.status.toUpperCase() === 'PENDING')
            ) {
                leastRejected = parseInt(item.level);
            }
            if (item.verified) {
                totalVerified += 1;
            }
        });

        const level = (leastRejected === 10 && totalVerified === 4) ? 3 : (leastRejected === 0 || totalVerified === 0) ? -1 : leastRejected - 1;
        return parseInt(level);

    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}


module.exports = {
    level,
}
