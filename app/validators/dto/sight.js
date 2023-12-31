//requirements for our request body
const yup = require('yup');

const registerSight = yup.object().shape({
    name: yup.string().required(),
    fk_trips_id: yup.number().required(),
    longitude: yup.number().required(), 
    latitude: yup.number().required(),
    startDate: yup.date().required(),
    endDate: yup.date().required(),
    photo: yup.string().url(),
})



module.exports = {registerSight};