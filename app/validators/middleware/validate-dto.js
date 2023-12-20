const tokenFunc = require('../../helperFunctions/tokenFunctions');

function validateDto(schema) {
    return async (req, res, next) => {
        try {
            await schema.validate(req.body);
            next();
        } catch (err) {
            res.status(404).send({ success: false, message: 'Invalid Request Body' });
        }
    }
}

module.exports = validateDto;