const pool = require("../db");
const { logger } = require("../utils/logger");

//this middleware will continue only if the request has a valid session attached to it.
const isAuthorized = async (req, res, next) => {
    // Get session from header
    const { nomUtilisateur } = req.session;
    // Check if not session
    if (nomUtilisateur) {
        const client = await pool.connect(); // Acquire a database client
        const userQuery = `SELECT * FROM login WHERE "nomUtilisateur" = $1;`;
        const userValues = [nomUtilisateur];
        const { rowCount, rows } = await client.query(userQuery, userValues);
        req.nomUtilisateur = nomUtilisateur;
        req.role = rows[0].status;
        req.id = rows[0].idWilaya;
        if (!rowCount) return res.status(401).send("Non authorisé!");
        return next();
    }
    return res.status(401).send("Non authorisé!");
};

//this middleware will continue only if the request was made bu a user the specified role.
const checkRole = (role) => {
    return async (req, res, next) => {
        const { nomUtilisateur } = req.session;
        const client = await pool.connect(); // Acquire a database client
        const userQuery = `SELECT * FROM login WHERE "nomUtilisateur" = $1;`;
        const userValues = [nomUtilisateur];
        const { rowCount, rows } = await client.query(userQuery, userValues);
        if (!rowCount) return res.status(403).send("Non authorisé!");
        const [user] = rows;


        if (user && user.status === role) {
            // User has the required role
            next(); // Move on to the next middleware/route handler
        } else {
            // User does not have the required role
            res.status(403).send("Non authorisé!");
        }
    };
};

const measureRequestDuration = (req, res, next) => {
    const start = Date.now();
    res.once('finish', () => {
        const duration = Date.now() - start;
        logger.log("Time taken to process " + req.originalUrl + " is: " +
            duration);
    });
    next();
};




module.exports = { isAuthorized, checkRole, measureRequestDuration };