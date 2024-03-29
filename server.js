//SETUP EXPRESS WEB SERVER

const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path'); 
const cookieParser = require("cookie-parser");

const app = express();

var corsOptions = {
    origin: "https://travel-mates.vercel.app",
    credentials: true,
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

//parse requests of content-type - cookie
app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to TravelPlanner application." });
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

//check sync with db
const db = require("./app/index.js");
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// DROP EXISTING TABLES AND RE-SYNC DATABASE - ONLY FOR DEVELOPMENT
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });


//Routes
const usersRoute = require('./app/routes/routerUsers.js');
const tripsRoute = require('./app/routes/routerTrips.js');
const sightsRoute = require('./app/routes/routerSights.js');

app.use('/api/users', usersRoute);
app.use('/api/trips', tripsRoute);
app.use('/api/sights', sightsRoute);


