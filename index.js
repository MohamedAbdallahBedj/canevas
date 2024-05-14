const express = require("express");
if (process.env.NODE_ENV !== "production") require('dotenv').config();
const cors = require("cors");
const path = require("path");
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require("./db");
const { logger } = require("./utils/logger");
const { measureRequestDuration } = require("./middleware/authMiddleware");
const app = express();

const PORT = 3001;
global.__basedir = __dirname;

//middleware
app.use(cors({
    origin: ['localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // enable set cookie
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(session({
    store: new pgSession({
        pool: pool,                // Connection pool
        createTableIfMissing: true,
        // Insert connect-pg-simple options here
    }),
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        sameSite: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 4 // 4 Hours
    }
}))
app.use(measureRequestDuration);

app.use("/api/uploads", express.static(__dirname + '/uploads'));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/api", require("./routes/api"));
app.use("/api/ag", require("./routes/ag"));
app.use("/api/pvr", require("./routes/pvr"));
app.use("/api/activites", require("./routes/activites"));
app.use("/api/cereales", require("./routes/cereales"))
app.use("/api/pomme-de-terre", require("./routes/pomme-de-terre"))
app.use("/api/agrumes", require("./routes/agrumes"))
app.use("/api/olives", require("./routes/olives"))
app.use("/api/dattes", require("./routes/dattes"))
app.use("/api/plasticulture", require("./routes/plasticulture"))
app.use("/api/ail", require("./routes/ail"))
app.use("/api/oignon", require("./routes/oignon"))
app.use("/api/colza", require("./routes/colza"))
app.use("/api/mais", require("./routes/mais"))
app.use("/api/legumes-secs", require("./routes/legumes-secs"))
app.use("/api/tomate-industrielle", require("./routes/tomate-industrielle"))
app.use("/api/bettrave-sucriere", require("./routes/bettrave-sucriere"))
app.use("/api/tournesol", require("./routes/tournesol"))
app.use("/api/pam-huiles-essentielles", require("./routes/pam-huiles-essentielles"))
app.use("/api/irrigation-appoint", require("./routes/irrigation-appoint"))
app.use("/api/chambres-froides-DPV", require("./routes/chambres-froides-DPV"))
app.use("/api/autres-canevas", require("./routes/autres-canevas"))
app.use("/api/filieres-animales", require("./routes/filieres-animales"))
app.use("/api/abbatoirs-et-tueries", require("./routes/abbatoirs-et-tueries"))
app.use("/api/campagne-de-vaccination", require("./routes/campagne-de-vaccination"))
app.use("/api/chambres-froides-origine-animale", require("./routes/chambres-froides-origine-animale"))
app.use("/api/evolution-production-animale", require("./routes/evolution-production-animale"))
app.use("/api/evolution-effectif-animale-betail", require("./routes/evolution-effectif-animale-betail"))
app.use("/api/evolution-effectif-animale-petites-elevage", require("./routes/evolution-effectif-animale-petites-elevage"))
app.use("/api/identification-eleveurs", require("./routes/identification-eleveurs"))
app.use("/api/indentification-producteurs", require("./routes/indentification-producteurs"))
app.use("/api/cultures-fourrageres", require("./routes/cultures-fourrageres"))
app.use("/api/vulgarisation", require("./routes/vulgarisation"))
app.use("/api/communication", require("./routes/communication"))
app.use("/api/budget", require("./routes/budget"))
app.use("/api/associations-cooperatives", require("./routes/associations-cooperatives"))
app.use("/api/conseils-administration", require("./routes/conseils-administration"))
app.use("/api/cartes-fellah", require("./routes/cartes-fellah"))
app.use("/api/bilan-emploi", require("./routes/bilan-emploi"))
app.use("/api/brq", require("./routes/brq"))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'build')));
    app.listen();
} else {
    app.listen(PORT, () => {
        logger.log('App is running on port ' + PORT);
    })
}