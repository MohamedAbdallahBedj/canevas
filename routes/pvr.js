const router = require("express").Router();
const pool = require("../db");
var format = require('pg-format');
const { isAuthorized } = require("../middleware/authMiddleware");
const { logger } = require("../utils/logger");


// _____________________________________________________________________________

router.get("/table", isAuthorized, async (req, res) => {
    const { wilaya, annee } = req.query;
    try {
        let queryTxt = `SELECT * FROM "public"."pointsVenteRamadhan"`;
        const filters = [];

        // Filter by wilaya
        if (wilaya) {
            filters.push(`"idWilaya" = ${wilaya}`);
        }
        // Filter by annee
        if (annee) {
            filters.push(`annee = ${annee}`);
        }
        // Add filters to the query if applicable
        if (filters.length > 0) {
            queryTxt += ` WHERE ${filters.join(' AND ')}`;
        }
        const { rows } = await pool.query(queryTxt);
        const ids = rows.map(row => row.idPointVente);
        let queryTxt2 = `SELECT * FROM "public"."pointsVenteRamadhanProduitsDisponibles" WHERE "idPointVente" IN (${ids.join(',')})`;
        const { rows: rows2 } = ids.length ? await pool.query(queryTxt2) : { rows: [] };
        const rowsPVR = rows.map(row => ({ ...row, products: rows2.filter(row_ => row.idPointVente === row_.idPointVente) }))
        res.json(rowsPVR);
    } catch (err) {
        logger.error('Time: ' + new Date().toLocaleString());
        logger.error('User: ' + JSON.stringify(req.nomUtilisateur));
        logger.error('Route: ' + req.originalUrl);
        logger.error('Error Content: ' + err.message);
        logger.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    } finally {
        }
});

router.post("/add", isAuthorized, async (req, res) => {
    try {
        const { row } = req.body;
        if (!(row)) return res.status(403).send("Données manquants!");
        const { products, ...rest } = row;
        // Construct the query dynamically based on the table name and row data
        const columns = Object.keys(rest).map(item => `"${item}"`).join(', ');
        const values = Object.values(rest);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        const queryTxt = `INSERT INTO "pointsVenteRamadhan" (${columns}) VALUES (${placeholders}) RETURNING *;`;
        const { rows } = await pool.query(queryTxt, values);
        if (products.length) {
            const queryTxt2 = format(`INSERT INTO "public"."pointsVenteRamadhanProduitsDisponibles" ("idProduit", "quantiteDisponible", "prixVente", "idPointVente") VALUES %L RETURNING *;`, products.map(item => Object.values({ ...item, idPointsVente: rows[0].idPointVente })));
            await pool.query(queryTxt2);
        }
        res.json('success');
    } catch (err) {
        logger.error('Time: ' + new Date().toLocaleString());
        logger.error('User: ' + JSON.stringify(req.nomUtilisateur));
        logger.error('Route: ' + req.originalUrl);
        logger.error('Error Content: ' + err.message);
        logger.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    } finally {
        }
});

router.post("/edit", async (req, res) => {
    try {
        const { row, id } = req.body;
        if (!(row && id)) return res.status(403).send("Données manquants!");

        const { products, ...rest } = row;
        // Constructing the SQL query dynamically based on the provided tablename and row
        let updateQuery = `UPDATE "pointsVenteRamadhan" SET`;
        // Extracting keys and values from row object
        const keys = Object.keys(rest);
        keys.forEach((key, index) => {
            updateQuery += ` "${key}" = $${index + 1}`;
            if (index < keys.length - 1) {
                updateQuery += ',';
            }
        });

        // Adding WHERE condition assuming there's an 'id' column for simplicity
        updateQuery += ` WHERE "idPointVente" = $${keys.length + 1};`;

        // Extracting values from properties object
        const values = Object.values(rest);

        // Adding id value for WHERE condition
        values.push(id);

        // Executing the SQL query
        const { rowCount } = await pool.query(updateQuery, values);

        const selectQuery = `SELECT * FROM "pointsVenteRamadhanProduitsDisponibles" WHERE "idPointVente" = ${id}`
        const { rows } = await pool.query(selectQuery);

        if (JSON.stringify(rows) !== JSON.stringify(products)) {
            const deleteQuery = `DELETE FROM "pointsVenteRamadhanProduitsDisponibles" WHERE "idPointVente" = ${id}`
            await pool.query(deleteQuery);
            const values = products.map(({ idProduit, quantiteDisponible, prixVente, idPointVente }) => ([idProduit, quantiteDisponible, prixVente, idPointVente]))
            const addQuery = format(`INSERT INTO "public"."pointsVenteRamadhanProduitsDisponibles" ("idProduit", "quantiteDisponible", "prixVente", "idPointVente") VALUES %L RETURNING *;`, values);
            await pool.query(addQuery);
        }
        return res.json(rowCount);
    } catch (err) {
        logger.error('Time: ' + new Date().toLocaleString());
        logger.error('User: ' + JSON.stringify(req.nomUtilisateur));
        logger.error('Route: ' + req.originalUrl);
        logger.error('Error Content: ' + err.message);
        logger.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    } finally {
        }
});



router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Constructing the SQL delete query dynamically based on the provided tablename
        let deleteQuery1 = `DELETE FROM "pointsVenteRamadhan" WHERE "idPointVente" = $1;`;
        let deleteQuery2 = `DELETE FROM "pointsVenteRamadhanProduitsDisponibles" WHERE "idPointVente" = $1;`;

        await pool.query(deleteQuery2, [id]);
        // Executing the SQL query
        const row = await pool.query(deleteQuery1, [id]);
        res.json(row.rowCount);
    } catch (err) {
        logger.error('Time: ' + new Date().toLocaleString());
        logger.error('User: ' + JSON.stringify(req.nomUtilisateur));
        logger.error('Route: ' + req.originalUrl);
        logger.error('Error Content: ' + err.message);
        logger.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    } finally {
        }
});


module.exports = router;