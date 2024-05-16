const router = require("express").Router();
const pool = require("../db");
const { isAuthorized } = require("../middleware/authMiddleware");
var multer = require('multer');
const { checkFileType } = require("../utils/exports");
var path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: 5e+6 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})


// _____________________________________________________________________________

router.get("/table", isAuthorized, async (req, res) => {
    const { table, wilaya, annee } = req.query;

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
        // Add filters to the query if applicable
        if (filters.length > 0) {
            queryTxt += ` WHERE ${filters.join(' AND ')}`;
        }
        const rows = await pool.query(queryTxt);
        res.json(rows.rows);
    } catch (err) {
        console.error('Time: ' + new Date().toLocaleString());
        console.error('User: ' + JSON.stringify(req.nomUtilisateur));
        console.error('Route: ' + req.originalUrl);
        console.error('Error Content: ' + err.message);
        console.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    }finally{
        }
});

router.post("/add", isAuthorized, upload.single('fichier'), async (req, res) => {
    try {
        const { tablename, fichier, ...row } = req.body;
        row.date = new Date(row.date)
        const ks = Object.keys(row);
        if (ks.includes('dateNaissance')) {
            row.dateNaissance = new Date(row.dateNaissance)
        }

        if (!(tablename && row)) return res.status(403).send("Tableau non trouvé!");
        if (req.file) row.fichier = req.file.filename;

        // Construct the query dynamically based on the table name and row data
        const columns = Object.keys(row).map(item => `"${item}"`).join(', ');
        const values = Object.values(row);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        const queryTxt = `INSERT INTO "${tablename}" (${columns}) VALUES (${placeholders}) RETURNING *`;

        const rows = await pool.query(queryTxt, values);
        res.json(rows.rows);
    } catch (err) {
        console.error('Time: ' + new Date().toLocaleString());
        console.error('User: ' + JSON.stringify(req.nomUtilisateur));
        console.error('Route: ' + req.originalUrl);
        console.error('Error Content: ' + err.message);
        console.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    }finally{
        }
});

router.post("/edit", isAuthorized, upload.single('fichier'), async (req, res) => {
    try {
        const { tableData, tablename, idCol, id, fichier, ...row } = req.body;
        row.date = new Date(row.date)
        const ks = Object.keys(row);
        if (ks.includes('dateNaissance')) {
            row.dateNaissance = new Date(row.dateNaissance)
        }
        if (!(tablename && row && id)) return res.status(403).send("Tableau non trouvé!");

        if (req.file) {
            const _ = await pool.query(`SELECT * FROM "${tablename}" WHERE "${idCol}" = $1;`, [id])
            const modifiedRow = _.rows[0];
            try {
                if (modifiedRow.fichier) {
                    fs.unlinkSync(`${__basedir}/uploads/${modifiedRow.fichier}`);
                }
                row.fichier = req.file.filename;
            } catch (error) {
                if (error.code !== 'ENOENT') throw error;
            }
        }
        // Constructing the SQL query dynamically based on the provided tablename and row
        let updateQuery = `UPDATE "${tablename}" SET`;
        // Extracting keys and values from row object
        const keys = Object.keys(row);
        keys.forEach((key, index) => {
            updateQuery += ` "${key}" = $${index + 1}`;
            if (index < keys.length - 1) {
                updateQuery += ',';
            }
        });

        // Adding WHERE condition assuming there's an 'id' column for simplicity
        updateQuery += ` WHERE "${idCol}" = $${keys.length + 1};`;

        // Extracting values from row object
        const values = Object.values(row);

        // Adding id value for WHERE condition
        values.push(id);

        // Executing the SQL query
        const queryRes = await pool.query(updateQuery, values);
        res.json(queryRes.rowCount);
    } catch (err) {
        console.error('Time: ' + new Date().toLocaleString());
        console.error('User: ' + JSON.stringify(req.nomUtilisateur));
        console.error('Route: ' + req.originalUrl);
        console.error('Error Content: ' + err.message);
        console.error("---------------------------------------------------------------");
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
        let deleteQuery = `DELETE FROM "${tablename}" WHERE "${idCol}" = $1 RETURNING *;`;
        const { rows, rowCount } = await pool.query(deleteQuery, [id]);
        if (rowCount) {
            try {
                if (rows[0].fichier) {
                    fs.unlinkSync(`${__basedir}/uploads/${rows[0].fichier}`);
                }
            } catch (error) {
                if (error.code !== 'ENOENT') throw error;
            }
        }
        // Executing the SQL query
        res.json(rows[0]);
    } catch (err) {
        console.error('Time: ' + new Date().toLocaleString());
        console.error('User: ' + JSON.stringify(req.nomUtilisateur));
        console.error('Route: ' + req.originalUrl);
        console.error('Error Content: ' + err.message);
        console.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    }finally{
        }
});


module.exports = router;