const mongoose = require('mongoose');

// Définition du schéma du vol
const FlightSchema = new mongoose.Schema({
  flight_number: { type: String, required: true }, // Numéro de vol
  airline: { type: String, required: true }, // Compagnie aérienne
  origin_airport: { type: String, required: true }, // Aéroport de départ (IATA)
  destination_airport: { type: String, required: true }, // Aéroport d'arrivée (IATA)
  departure_time: { type: String, required: true }, // Heure de départ
  arrival_time: { type: String, required: true }, // Heure d'arrivée
  price: { type: Number, required: true }, // Prix du vol
  date: { type: Date, required: true } // Date du vol
});

// Création du modèle Mongoose
const Flight = mongoose.model('Flight', FlightSchema);

// Export du modèle pour l'utiliser dans d'autres fichiers
module.exports = Flight;