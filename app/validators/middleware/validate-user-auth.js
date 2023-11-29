const tokenFunc = require('../../helperFunctions/tokenFunctions');

function validateUserAuth() {
    return async (req, res, next) => {
        try {
            tokenFunc.validateToken(req, res);
            console.log("validate user DTO");
            next();
        } catch (err) {
            res.status(404).send({ success: false, message: 'Invalid Request Body' });
        }
    }
}

module.exports = { validateUserAuth };