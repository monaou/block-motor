import React, { useState } from 'react';
import styled from 'styled-components';
import { Title, TextField, Button } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { useSafeBalances } from './hooks/useSafeBalances';
import BalancesTable from './components/BalancesTable';
import Modal from 'react-modal';
import ImageUpload from './components/ImageUpload';
// import contractAddress from './contractAddress.json';
import { Web3Storage } from 'web3.storage'

Modal.setAppElement('#root');

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const WalletInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
`;

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK();
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageId, setImageId] = useState('');
  const [balances] = useSafeBalances(sdk);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleRegister = () => {
    setModalOpen(true);
  };

  const handleSave = async () => {
    // NFTミントのロジックをここに追加
    if (!process.env.REACT_APP_WEB3_API_KEY) {
      throw new Error("API key is not set in the environment variables");
    }
    const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_API_KEY })
    if (selectedFile) {
      // 他のロジック
      const rootCid = await client.put([selectedFile], {
        name: 'experiment',
        maxRetries: 3
      });
      const res = await client.get(rootCid) // Web3Response
      if (res) {
        const files = await res.files() // Web3File[]
        for (const file of files) {
          console.log("file.cid:", file.cid)

        }
        setModalOpen(false);
      }
    }

  };
  // ... SafeAppコンポーネントの中
  const handleImageUploadSuccess = (response: any) => {
    console.log(response)
    // 応答に応じて、NFTのミントを呼び出すロジック
  };

  const handleImageUploadError = (error: any) => {
    console.error("Error uploading image:", error);
  };

  return (
    <Container>
      <WalletInfo>
        <Title size="sm">Wallet: {safe.safeAddress}</Title>
      </WalletInfo>
      <Button size="md" color="primary" onClick={handleRegister}>
        Register
      </Button>
      <Modal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)}>
        <Title size="xs">Register NFT</Title>
        <TextField
          label="Image Name"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
        />
        <TextField
          label="Image Id"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
        />
        <ImageUpload
          onUploadSuccess={handleImageUploadSuccess}
          onUploadError={handleImageUploadError}
          onFileSelected={(file) => setSelectedFile(file)}
        />
        <Button size="md" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal>

      <BalancesTable balances={balances} />
    </Container >
  );
};

export default SafeApp;