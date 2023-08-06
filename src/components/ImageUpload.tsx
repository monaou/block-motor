import React, { useState } from 'react';
import { Button } from '@gnosis.pm/safe-react-components';

interface ImageUploadProps {
    onUploadSuccess: (response: any) => void;
    onUploadError: (error: any) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, onUploadError }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        try {
            const response = await fetch('YOUR_API_ENDPOINT', {
                method: 'POST',
                body: preview,
                // ... 他の必要なヘッダーや設定
            });

            const data = await response.json();
            onUploadSuccess(data);
        } catch (error) {
            onUploadError(error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Preview" style={{ width: '100px', height: '100px' }} />}
            <Button size="md" color="primary" onClick={handleUpload}>AI Check</Button>
        </div>
    );
};

export default ImageUpload;
