const router = require("express").Router();
const pool = require("../db");
const { isAuthorized } = require("../middleware/authMiddleware");

// _____________________________________________________________________________

router.get("/table", isAuthorized, async (req, res) => {
    const { wilaya, annee } = req.query;
    try {
        let queryTxt = `SELECT ag.*, saaa."idAssociation", saaa.denomination, agps."groupeRepresente", af."filiereFr", af."filiereAr" FROM "public"."associationGeneraleCAW" ag LEFT JOIN "public"."associationGeneraleCAWAR" agar USING("idMembre") LEFT JOIN "public"."situationAssociationsAgricolesAssainissement" saaa USING("idAssociation") LEFT JOIN  "public"."associationGeneraleCAWPS" agps USING("idMembre") LEFT JOIN "public"."associationFiliere" af USING("idFiliere")`;
        const filters = [];

        // Filter by wilaya
        if (wilaya) {
            filters.push(`ag."idWilaya" = ${wilaya}`);
        }
        // Filter by annee
        if (annee) {
            filters.push(`ag.annee = ${annee}`);
        }
        // Add filters to the query if applicable
        if (filters.length > 0) {
            queryTxt += ` WHERE ${filters.join(' AND ')}`;
        }
        const rows = await pool.query(queryTxt);
        const rows_ = rows.rows.map(item => {
            if (item.idType === 1) return {
                organismeRepresente: item.denomination, filiereRepresentee: item.filiereAr, ...item
            };
            if (item.idType === 2) return {
                organismeRepresente: item.groupeRepresente, filiereRepresentee: item.filiereAr, ...item
            };
            if (item.idType === 3) return {
                organismeRepresente: '/', filiereRepresentee: item.filiereAr, ...item
            };
        })
        res.json(rows_);
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

router.post("/add", isAuthorized, async (req, res) => {
    try {
        const { row } = req.body;
        const { organismeRepresente, ...rest } = row;
        if (!(row)) return res.status(403).send("Tableau non trouvé!");

        // Construct the query dynamically based on the table name and row data
        const columns = Object.keys(rest).map(item => `"${item}"`).join(', ');
        const values = Object.values(rest);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        const queryTxt = `INSERT INTO "associationGeneraleCAW" (${columns}) VALUES (${placeholders}) RETURNING *`;

        const secondRelation = parseInt(rest.idType) === 1 ? 'associationGeneraleCAWAR' : 'associationGeneraleCAWPS'
        const secondParam = parseInt(rest.idType) === 1 ? 'idAssociation' : 'groupeRepresente'
        const queryTxt2 = `INSERT INTO "${secondRelation}" ("idMembre", "${secondParam}") VALUES ($1,$2) RETURNING *`;

        const rows = await pool.query(queryTxt, values);
        if (rest.idType === '1' || rest.idType === '2') {
            await pool.query(queryTxt2, [rows.rows[0].idMembre, organismeRepresente]);
        }
        res.json(rows.rows[0].id);
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

router.post("/edit", async (req, res) => {
    try {
        const { properties, id } = req.body;
        if (!(properties && id)) return res.status(403).send("Tableau non trouvé!");
        // Constructing the SQL query dynamically based on the provided tablename and properties
        let updateQuery = `UPDATE "associationGeneraleCAW" SET`;
        // Extracting keys and values from properties object
        const keys = Object.keys(properties);
        keys.forEach((key, index) => {
            updateQuery += ` "${key}" = $${index + 1}`;
            if (index < keys.length - 1) {
                updateQuery += ',';
            }
        });

        // Adding WHERE condition assuming there's an 'id' column for simplicity
        updateQuery += ` WHERE "idMembre" = $${keys.length + 1};`;

        // Extracting values from properties object
        const values = Object.values(properties);

        // Adding id value for WHERE condition
        values.push(id);

        // Executing the SQL query
        const row = await pool.query(updateQuery, values);
        res.json(row.rowCount);
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



router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Constructing the SQL delete query dynamically based on the provided tablename
        let deleteQuery = `DELETE FROM "associationGeneraleCAW" WHERE "idMembre" = $1;`;
        let deleteQuery1 = `DELETE FROM "associationGeneraleCAWAR" WHERE "idMembre" = $1;`;
        let deleteQuery2 = `DELETE FROM "associationGeneraleCAWPS" WHERE "idMembre" = $1;`;

        await pool.query(deleteQuery1, [id]);
        await pool.query(deleteQuery2, [id]);
        // Executing the SQL query
        const row = await pool.query(deleteQuery, [id]);
        res.json(row.rowCount);
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