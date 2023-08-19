import { ImageAnnotatorClient } from '@google-cloud/vision';
import fs from 'fs';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

// set credentials path needed
// export GOOGLE_APPLICATION_CREDENTIALS=/home/monaou/block-motor/macro-spider-394301-f2d664c749ae.json
// 

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

class CloudVisionClient {
    client;
    constructor() {
        this.client = new ImageAnnotatorClient();
    }
    async fetchImageToText(base64Image) {
        const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64');

        const request = {
            image: {
                content: imageBuffer,
            },
            imageContext: {
                languageHints: ['ja'],
            },
        };
        // console.log(request)
        const [result] = await this.client.objectLocalization(request);
        // const detections = result.textAnnotations;
        // const description = detections?.[0].description;
        // console.log(description)
        return result;
    }
}

app.post('/api/analyze-image', async (req, res) => {
    try {
        const imageBuffer = req.body.image; // 画像データをバッファとして取得
        const client = new CloudVisionClient();
        const result = await client.fetchImageToText(imageBuffer);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred processing the image.' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});