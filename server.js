require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Flight = require("./models/Flight");


const app = express();
const port = process.env.PORT || 3000;
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./config/key.json";

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
app.post("/api/webhook", async (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;
  console.log("✅ Webhook reçu avec intent:", intentName);

  if (intentName === "Rechercher un vol") {
    const origin_airport = req.body.queryResult.parameters.origin_airport;
    const destination_airport = req.body.queryResult.parameters.destination || req.body.queryResult.parameters.destination_airport;
    const date = req.body.queryResult.parameters.date;
    console.log("📩 Paramètres reçus bruts:", JSON.stringify(req.body.queryResult.parameters, null, 2));

      try {
          const flights = await Flight.find({ 
            origin_airport,
            destination_airport,
            date: date.toString()
          });

          if (flights.length > 0) {
              let responseText = "Voici les vols disponibles :\n";
              flights.forEach(flight => {
                  responseText += `✈️ ${flight.airline} - ${flight.flight_number} - ${flight.departure_time}\n`;
              });
              console.log("✅ Vols trouvés:", flights);
              res.json({ fulfillmentText: responseText });
          } else {
              console.log("⚠️ Aucun vol trouvé.");
              res.json({ fulfillmentText: "Désolé, aucun vol disponible pour cette date et destination." });
          }
      } catch (error) {
          console.error("❌ Erreur lors de la recherche:", error);
          res.json({ fulfillmentText: "Une erreur est survenue lors de la recherche des vols." });
      }
  } else {
      res.json({ fulfillmentText: "Je n'ai pas compris votre demande." });
  }
});

app.get("/test-flights", async (req, res) => {
  try {
      const testFlights = await Flight.find({ destination_airport: "JFK", date: "2024-06-20" });
      console.log("🔎 Résultats trouvés dans MongoDB :", testFlights);
      res.json(testFlights);
  } catch (error) {
      console.error("❌ Erreur lors de la requête de test :", error);
      res.status(500).json({ message: "Erreur serveur", error });
  }
});


// Lancer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
