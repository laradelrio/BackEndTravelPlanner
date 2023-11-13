//requirements for our request body
const yup = require('yup');

const registerTrip = yup.object().shape({
    name: yup.string().required(),
    user: yup.number().required(),
    destination: yup.string().required(),
    startDate: yup.date().required(),
    endDate: yup.date().required(),
    photo: yup.string().url(),
})

module.exports = {registerTrip};