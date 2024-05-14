const router = require("express").Router();
const pool = require("../db");
const { isAuthorized } = require("../middleware/authMiddleware");
const { logger } = require("../utils/logger");

// _____________________________________________________________________________

router.get("/table", isAuthorized, async (req, res) => {
    const { table, wilaya, annee, date, type } = req.query;

    try {
        if (!table) return res.status(403).send("Tableau non trouvé!");

        let queryTxt = `SELECT * FROM "${table}"`;
        const filters = [];

        // Filter by wilaya
        if (wilaya) {
            filters.push(`"idWilaya" = ${wilaya}`);
        }
        // Filter by annee
        if (annee) {
            filters.push(`annee = ${annee}`);
        }
        // Filter by type
        if (type) {
            filters.push(`type = ${type}`);
        }
        // Filter by type
        if (date) {
            filters.push(`date = '${date}'`);
        }
        // Add filters to the query if applicable
        if (filters.length > 0) {
            queryTxt += ` WHERE ${filters.join(' AND ')}`;
        }
        const rows = await pool.query(queryTxt);
        res.status(200).send(rows.rows);
    } catch (err) {
        logger.error('Time: ' + new Date().toLocaleString());
        logger.error('User: ' + JSON.stringify(req.nomUtilisateur));
        logger.error('Route: ' + req.originalUrl);
        logger.error('Error Content: ' + err.message);
        logger.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    }finally{
        }
});

router.post("/add", isAuthorized, async (req, res) => {
    try {
        const { tablename, row } = req.body;
        if (!(tablename && row)) return res.status(403).send("Tableau non trouvé!");

        // Construct the query dynamically based on the table name and row data
        const columns = Object.keys(row).map(item => `"${item}"`).join(', ');
        const values = Object.values(row);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        const queryTxt = `INSERT INTO "${tablename}" (${columns}) VALUES (${placeholders}) RETURNING *`;

        const rows = await pool.query(queryTxt, values);
        res.status(200).send(rows.rows);
    } catch (err) {
        logger.error('Time: ' + new Date().toLocaleString());
        logger.error('User: ' + JSON.stringify(req.nomUtilisateur));
        logger.error('Route: ' + req.originalUrl);
        logger.error('Error Content: ' + err.message);
        logger.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    }finally{
        }
});

router.post("/edit", isAuthorized, async (req, res) => {
    try {
        const { tablename, properties, idCol, id } = req.body;
        if (!(tablename && properties && id)) return res.status(403).send("Tableau non trouvé!");
        // Constructing the SQL query dynamically based on the provided tablename and properties
        let updateQuery = `UPDATE "${tablename}" SET`;
        // Extracting keys and values from properties object
        const keys = Object.keys(properties);
        keys.forEach((key, index) => {
            updateQuery += ` "${key}" = $${index + 1}`;
            if (index < keys.length - 1) {
                updateQuery += ',';
            }
        });

        // Adding WHERE condition assuming there's an 'id' column for simplicity
        updateQuery += ` WHERE "${idCol}" = $${keys.length + 1};`;

        // Extracting values from properties object
        const values = Object.values(properties);

        // Adding id value for WHERE condition
        values.push(id);

        // Executing the SQL query
        const row = await pool.query(updateQuery, values);
        res.json(row.rowCount);
    } catch (err) {
        logger.error('Time: ' + new Date().toLocaleString());
        logger.error('User: ' + JSON.stringify(req.nomUtilisateur));
        logger.error('Route: ' + req.originalUrl);
        logger.error('Error Content: ' + err.message);
        logger.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    }finally{
        }
});



router.delete("/delete/:id", isAuthorized, async (req, res) => {
    try {
        const { tablename, idCol } = req.body;
        const { id } = req.params;
        if (!(tablename)) return res.status(403).send("Tableau non trouvé!");
        // Constructing the SQL delete query dynamically based on the provided tablename
        let deleteQuery = `DELETE FROM "${tablename}" WHERE "${idCol}" = $1;`;

        // Executing the SQL query
        const row = await pool.query(deleteQuery, [id]);
        res.json(row.rowCount);
    } catch (err) {
        logger.error('Time: ' + new Date().toLocaleString());
        logger.error('User: ' + JSON.stringify(req.nomUtilisateur));
        logger.error('Route: ' + req.originalUrl);
        logger.error('Error Content: ' + err.message);
        logger.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    }finally{
        }
});


module.exports = router;