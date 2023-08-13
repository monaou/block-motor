import { ImageAnnotatorClient } from '@google-cloud/vision';
import fs from 'fs';

class CloudVisionClient {
    private readonly client: ImageAnnotatorClient;

    constructor() {
        this.client = new ImageAnnotatorClient();
    }

    async fetchImageToText(path: string): Promise<string | undefined> {
        const request = {
            image: {
                content: fs.readFileSync(path),
            },
            imageContext: {
                languageHints: ['ja'],
            },
        };
        const [result] = await this.client.textDetection(request);
        const detections = result.textAnnotations;
        const description = detections?.[0].description;
        return description ?? undefined;
    }
}

//即時関数で実行
(async () => {
    const client = new CloudVisionClient();
    const result = await client.fetchImageToText('./golf.png');
    console.log(result);
})();