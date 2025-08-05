const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/identify', async (req, res) => {
    const { base64Image } = req.body;

    try {
        const response = await axios.post(
            'https://api.plant.id/v2/identify',
            {
                images: [base64Image],
                modifiers: ["crops_fast", "similar_images"],
                plant_language: "en",
                plant_details: ["common_names", "url", "wiki_description"]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': process.env.API_KEY
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error identifying plant.");
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
