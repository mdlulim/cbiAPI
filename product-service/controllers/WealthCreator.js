
const kycService  = require('../services/KYC');
const userService = require('../services/User');
// const wealthCreatorService = require('../services/WealthCreator');

/**
 * Validate if Member Qualifies to be a Wealth Creator
 * 
 * For a member to become a Wealth Creator, they need to meet the requirements below:
 * - Must apply for a Wealth Creator status (subscription/purchase)
 * - Must have accepted Terms and Conditions for Wealth Creator status (checkbox during purchase)
 * - Must meet Level 2 KYC requirements
 * - Must have referred at least 2 members who have accepted and become members (active referrals)
 * - Must complete and passed Wealth Creator entrance test
 * - Must pay Registration Fee as well as monthly/annual subscription fee (active WC)
 */
async function qualify(req, res) {
    try {
        const { id } = req.user;
        const { terms_agree } = req.body;

        let status = false;
        let message = null;

        // retrieve user details
        const user = await userService.show(id);
        if (user.status.toUpperCase() === 'ACTIVE') {
        
            // check if terms accepted
            if (terms_agree) {
    
                // retrieve wealth creator kyc level
                const level = await kycService.level(id);
    
                // check if kyc level >= 2
                if (level >= 2) {
    
                    // check if member has referred at least 2 members
                    // who have accepted and become members (active referrals)
                    const referrals = await userService.directReferrals(id, 'ACTIVE');
    
                    if (referrals) {
                        const { count } = referrals;
                        status = (count && count >= 2);
                    } else message = 'You must have referred at least 2 members who have accepted and become members';
                } else message = 'You must meet Level 2 KYC requirements';
            } else message = 'Please accept Wealth Creator Terms and Conditions';
        } else message = 'You need to be an active member to qualify';

        // not a wealth creator
        return res.send({
            success: true,
            data: {
                message,
                qualify: status,
            },
        });
    } catch (err) {
        console.error(err.message || null);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}


module.exports = {
    qualify,
};