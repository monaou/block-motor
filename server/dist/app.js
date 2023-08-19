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

        const [textResult] = await this.client.textDetection(request);
        const [objectResult] = await this.client.objectLocalization(request);

        const textDetections = textResult.textAnnotations;
        const description = textDetections?.[0]?.description;

        let isValid = false;
        const const_score_valid = 0.9; // ここで閾値を設定します。適切な値に変更してください。

        for (const data of objectResult.localizedObjectAnnotations) {
            if (data.name === 'Car' && data.score > const_score_valid) {
                isValid = true;
                break;
            }
        }

        return {
            text: description,
            objects: objectResult.localizedObjectAnnotations,
            isCarWithValidScore: isValid
        };
    }
}

app.post('/api/analyze-image', async (req, res) => {
    try {
        const imageBuffer = req.body.image; // 画像データをバッファとして取得
        const client = new CloudVisionClient();
        const result = await client.fetchImageToText(imageBuffer);
        res.json(result.localizedObjectAnnotations);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred processing the image.' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});