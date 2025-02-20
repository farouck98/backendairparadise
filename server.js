require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Activer CORS pour éviter les problèmes de requêtes entre Render et Postman/Dialogflow
app.use(cors());

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas connecté"))
.catch(err => console.error("❌ Erreur de connexion MongoDB Atlas :", err));

app.use(bodyParser.json());

// Importer les routes des vols
const flightsRoutes = require("./routes/flights");
app.use("/api/flights", flightsRoutes);

// Route de test
app.get("/", (req, res) => {
    res.send("🚀 API Air Paradise fonctionne !");
});

// Webhook Dialogflow amélioré pour chercher des vols
app.post("/webhook", async (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;
    console.log("Intent reçu:", intentName);

    if (intentName === "Rechercher un vol") {
        const { destination, date } = req.body.queryResult.parameters;
        try {
            const Flight = require("./models/Flight");
            const flights = await Flight.find({
                destination_airport: destination,
                date: date
            });

            if (flights.length > 0) {
                let responseText = "Voici les vols disponibles :\n";
                flights.forEach(flight => {
                    responseText += `✈ ${flight.airline} - ${flight.flight_number} - ${flight.departure_time} ➝ ${flight.arrival_time} - Prix: ${flight.price}€\n`;
                });

                res.json({ fulfillmentText: responseText });
            } else {
                res.json({ fulfillmentText: "Désolé, aucun vol disponible pour cette destination et date." });
            }
        } catch (error) {
            res.json({ fulfillmentText: "Une erreur est survenue lors de la recherche des vols." });
        }
    } else {
        res.json({ fulfillmentText: "Je n'ai pas compris votre demande." });
    }
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
