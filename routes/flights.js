const express = require("express");
const router = express.Router();
const Flight = require("../models/Flight"); // Vérifiez ce chemin

// Récupérer tous les vols
router.get("/", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;