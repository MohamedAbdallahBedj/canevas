// Import required packages and modules
const router = require("express").Router(); // Initialize Express router
const pool = require("../db"); // Database connection pool
const bcrypt = require('bcryptjs'); // Library for password hashing
const { isAuthorized, checkRole } = require("../middleware/authMiddleware"); // Custom middleware for user authorization
const { logger } = require("../utils/logger");

// Function to check if an email is valid
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Function to check if a password is valid
const isValidPassword = (password) => password.length >= 8;

// Route for user login
router.post('/login', async (req, res) => {
  const { nomUtilisateur, motDePasse } = req.body;


  try {
    // Query the database for a user with the provided nomUtilisateur
    const result = await pool.query('SELECT * FROM login WHERE "nomUtilisateur" = $1', [nomUtilisateur]);
    const user = result.rows[0];

    // Compare the provided motDePasse with the hashed motDePasse stored in the database
    if (user && await bcrypt.compare(motDePasse, user.motDePasse)) {
      // Set user ID in session for authentication
      req.session.nomUtilisateur = user.nomUtilisateur;
      const { idWilaya, nomUtilisateur, status } = user;
      return res.status(200).json({ idWilaya, nomUtilisateur, role: status });
    } else {
      return res.status(401).send('Email ou mot de passe erronées!');
    }
  } catch (error) {
    await pool.query('ROLLBACK') // Rollback any ongoing database transactions
    console.error('Time: ' + new Date().toLocaleString());
    console.error('Route: ' + req.originalUrl);
    console.error('Error Content: ' + error.message);
    console.error("---------------------------------------------------------------");
    res.status(500).send("Server error");
  } finally {
  }
});

// Route for user registration
router.post('/register', isAuthorized, checkRole("AdminGenerale"), async (req, res) => {
  const { nomUtilisateur, motDePasse, status, idWilaya } = req.body;

  try {
    // Check if the provided nomUtilisateur already exists in the database
    const nomUtilisateurExistsResult = await pool.query('SELECT * FROM public.login WHERE "nomUtilisateur" = $1', [nomUtilisateur]);
    if (nomUtilisateurExistsResult.rows.length > 0) {
      return res.status(400).send("Nom d'utilisateur existe déja!");
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10); // Hash the motDePasse for storage
    const query = `
            INSERT INTO public.login ("nomUtilisateur", "motDePasse", "status", "idWilaya")
            VALUES ($1, $2, $3, $4)
        `;
    // Insert user information into the database
    await pool.query(query, [nomUtilisateur, hashedPassword, status, idWilaya]);
    res.status(201).send('Utilisateur enregistré avec succés.');
  } catch (error) {
    await pool.query('ROLLBACK') // Rollback any ongoing database transactions
    console.error('Time: ' + new Date().toLocaleString());
    console.error('Route: ' + req.originalUrl);
    console.error('Error Content: ' + error.message);
    console.error("---------------------------------------------------------------");
    res.status(500).send("Server error");
  } finally {
  }
});


// Route for user password modification
router.post('/password', isAuthorized, async (req, res) => {
  const { oldPass, newPass } = req.body;
  if (oldPass === newPass) return res.status(400).send("L'ancien mot de passe ne peut plus être utilisé, veuillez modifier le mot de passe.");
  if (newPass.length < 6) return res.status(400).send("Le nouveau mot de passe doit être composé d'au moins 6 caractères");
  const { nomUtilisateur } = req;
  try {
    // Check if the provided nomUtilisateur already exists in the database
    const result = await pool.query('SELECT * FROM public.login WHERE "nomUtilisateur" = $1', [nomUtilisateur]);
    const user = result.rows[0];

    // Compare the provided motDePasse with the hashed motDePasse stored in the database
    if (user && await bcrypt.compare(oldPass, user.motDePasse)) {
      // change the password
      const query = 'UPDATE public.login set "motDePasse" = $1 WHERE "nomUtilisateur" = $2;'
      const hashedPassword = await bcrypt.hash(newPass, 10); // Hash the motDePasse for storage
      await pool.query(query, [hashedPassword, nomUtilisateur]);
      logger.log('Password Change Detected: ' + nomUtilisateur + ' At Time ' + new Date().toLocaleString());
      res.status(201).send('Mot de passe est changé avec succés.');
    } else {
      return res.status(401).send('Mot de passe erronées!');
    }
  } catch (error) {
    await pool.query('ROLLBACK') // Rollback any ongoing database transactions
    console.error('Time: ' + new Date().toLocaleString());
    console.error('Route: ' + req.originalUrl);
    console.error('Error Content: ' + error.message);
    console.error("---------------------------------------------------------------");
    res.status(500).send("Server error");
  } finally {
  }
});

// Route to verify user's authorization
router.post("/verify", isAuthorized, async (req, res) => {
  try {
    res.status(200).json({ nomUtilisateur: req.nomUtilisateur, role: req.role, idWilaya: req.id }); // Return the user's authorized data
  } catch (err) {
    console.error('Time: ' + new Date().toLocaleString());
    console.error('Route: ' + req.originalUrl);
    console.error('Error Content: ' + err.message);
    console.error("---------------------------------------------------------------");
    res.status(500).send("Server error");
  }
});

// Route to log out a user
router.get("/logout", isAuthorized, async (req, res) => {
  try {
    req.session.destroy(); // Destroy the user's session for logout
    return res.status(200).send();
  } catch (err) {
    console.error('Time: ' + new Date().toLocaleString());
    console.error('Route: ' + req.originalUrl);
    console.error('Error Content: ' + err.message);
    console.error("---------------------------------------------------------------");
    res.status(500).send("Server error");
  }
});


module.exports = router; // Export the router for use in other parts of the application