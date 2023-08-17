import React, { useState } from 'react';
import { Button } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';

interface ImageUploadProps {
    onUploadSuccess: (response: any) => void;
    onUploadError: (error: any) => void;
    onFileSelected: (file: File) => void;
}

const FileButton = styled.label`
  display: inline-block;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  font-size: 14px;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const SplitFieldsContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const Field = styled.textarea`
  width: 50%;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  padding: 10px;
  &:first-child {
    margin-right: 10px;
  }
`;

const ImagePreview = styled.img`
  width: 100px; // 幅を調整します。
  height: 100px; // 高さを固定します。
  border: 1px solid #ccc;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 10px;
`;

const FieldContainer = styled.div`
  width: calc(50% - 10px); // 各フィールドの幅を半分にして、margin分を引きます。
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, onUploadError, onFileSelected }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);

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
            setAnalysisResult(data.result);
            onUploadSuccess(data);
        } catch (error) {
            onUploadError(error);
        }
    };

    return (
        <div>
            <FileButton>
                Select File
                <HiddenInput type="file" onChange={handleFileChange} />
            </FileButton>
            <Button size="md" color="primary" onClick={handleUpload}>AI Check</Button>
            <SplitFieldsContainer>
                <FieldContainer>
                    {preview ? <ImagePreview src={preview} alt="Selected Image" /> : null}
                </FieldContainer>
                <Field readOnly value={analysisResult || ''} />
            </SplitFieldsContainer>
        </div>
    );
};

export default ImageUpload;
