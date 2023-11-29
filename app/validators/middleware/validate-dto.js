const tokenFunc = require('../../helperFunctions/tokenFunctions');

function validateDto(schema){
    return async (req, res, next) => {
        try{
            if( req.url === '/byEmail'|| req.url === '/login' ){
                await schema.validate(req.body);
                console.log("login/reg pre");
            } else {
                tokenFunc.validateToken(req,res);
                console.log("validate user DTO");
            }
                        
            next();
        }catch(err){
                res.status(404).send({success: false, message:'Invalid Request Body'});
        }
    }
}

module.exports = validateDto;