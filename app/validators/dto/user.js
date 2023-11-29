//requirements for our request body
const yup = require('yup');

const registerUser = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    passwordConfirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match').required(),
    photo: yup.string().url(),
})

const loginUser = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
})

module.exports = { registerUser, loginUser };