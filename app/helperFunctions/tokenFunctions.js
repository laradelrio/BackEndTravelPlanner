const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const dotenv = require('dotenv');
const cookie = require('cookie');

function validateToken(req, res) {

    const token = req.cookies.token;
    
    if (token === null) {
        res.status(401).send({ success: false, message: 'Unauthorized' });
    } else {
        let secretJWT = process.env.TOKEN_SECRET;
        const verified = jwt.verify(token, secretJWT, (err, decoded) => {
            if (err) {
                logout(res)
            } else {
                checkTokenExpiry(token, decoded.id_user, res)
                return
            }
        });
    }
};

function checkTokenExpiry(token, userId, res) {
    const decoded = jwtDecode.jwtDecode(token);
    let expiryMin = (decoded.exp) / 60;
    let minNow = (new Date().getTime() / 1000) / 60;
    let minTillExpires = expiryMin - minNow;

    if (minTillExpires < 15) {
        return createToken(userId, res)
    }

    return
}

function createToken(userId, res) {

    const token = jwt.sign({
        id_user: userId,
    }, process.env.TOKEN_SECRET, { expiresIn: '1h' })

    const serialized = cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none', //prevents the cookie from being sent with cross-site requests
        maxAge: 60 * 60 * 24 * 30,  // sets the maximum age of the cookie in seconds. here: 30 days
        path: '/', // cookie is valid for the entire website
    });
    
    return res.setHeader('Set-Cookie', serialized);
}

function logout(res) {
    const serialized = cookie.serialize('token', null, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: -1,
        path: '/',
    });
    res.setHeader('Set-Cookie', serialized);
    res.status(200).send({ success: false, message: 'Unauthorized' });
    return  res.send( 401 );
}


module.exports = {
    validateToken, createToken, checkTokenExpiry, logout
}