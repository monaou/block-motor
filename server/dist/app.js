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
            features: [
                { type: 'TEXT_DETECTION' },
                { type: 'OBJECT_LOCALIZATION' }
            ],
            imageContext: {
                languageHints: ['ja'],
            },
        };

        const [result] = await this.client.annotateImage(request);
        console.log(result)
        const fullText = result.fullTextAnnotation?.text;

        // 日本のナンバープレートの正規表現を緩くする
        const plateRegex = /[一-龯ぁ-ん]{1,4}\s\d{2,4}.{2,3}\n?[ぁ-ん]\d{2,4}-\d{2,4}/g;

        let isTextWithValid = false;
        let matchedPlates = [];
        if (fullText) {
            console.log(fullText);
            let match;
            while ((match = plateRegex.exec(fullText)) !== null) {
                matchedPlates.push(match[0]);
            }
            if (matchedPlates.length) {
                isTextWithValid = true;
            }
        }

        let lastMatchedPlate = matchedPlates[matchedPlates.length - 1];  // 一致したパターンの中で最後のもの

        let isValid = false;
        const const_score_valid = 0.5;
        for (const data of result.localizedObjectAnnotations) {
            if ((data.name === 'Car' || data.name === 'Van') && data.score > const_score_valid) {
                isValid = true;
                break;
            }
        }

        return {
            text: isTextWithValid ? lastMatchedPlate : null,
            isTextWithValid: isTextWithValid,
            objects: result.localizedObjectAnnotations,
            isCarWithValidScore: isValid
        };
    }
}

app.post('/api/analyze-image', async (req, res) => {
    try {
        const imageBuffer = req.body.image;
        const client = new CloudVisionClient();
        const result = await client.fetchImageToText(imageBuffer);
        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred processing the image.' });
    }
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});