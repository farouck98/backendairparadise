require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas connecté"))
.catch(err => console.error("❌ Erreur de connexion MongoDB Atlas :", err));

app.use(bodyParser.json());

// Route de test
app.get("/", (req, res) => {
    res.send("🚀 API Air Paradise fonctionne !");
});

// Route pour le webhook Dialogflow
app.post("/webhook", (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;
    console.log("Intent reçu:", intentName);

    if (intentName === "Rechercher un vol") {
        res.json({
            fulfillmentText: "Je peux vous aider à rechercher un vol."
        });
    } else {
        res.json({
            fulfillmentText: "Je n'ai pas compris votre demande."
        });
    }
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
