import React, { useState } from 'react';
import { Button } from '@gnosis.pm/safe-react-components';

interface ImageUploadProps {
    onUploadSuccess: (response: any) => void;
    onUploadError: (error: any) => void;
    onFileSelected: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, onUploadError, onFileSelected }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        if (file) {
            onFileSelected(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/analyze-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: preview }),
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
