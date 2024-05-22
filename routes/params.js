const router = require("express").Router();
const pool = require("../db");
const { isAuthorized } = require("../middleware/authMiddleware");

// _____________________________________________________________________________

router.get("/years", isAuthorized, async (req, res) => {

    try {
        const data = {
            campagnes: [2021, 2022, 2023],
            years: [2021, 2022, 2023, 2024],
            pap: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]
        }
        res.status(200).send(data);
    } catch (err) {
        console.error('Time: ' + new Date().toLocaleString());
        console.error('User: ' + JSON.stringify(req.nomUtilisateur));
        console.error('Route: ' + req.originalUrl);
        console.error('Error Content: ' + err.message);
        console.error("---------------------------------------------------------------");
        res.status(500).send("Server error");
    } finally {
    }
});

module.exports = router;