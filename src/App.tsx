import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Title, TextField, Button } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import useSafeNFTs from './hooks/useSafeBalances';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';
import Modal from 'react-modal';
import ImageUpload from './components/ImageUpload';
import contractAddress from './shared_json/contractAddress.json';
import web3Mint from './shared_json/Web3Mint.json';
import { Web3Storage } from 'web3.storage'
import { ethers } from 'ethers';
import NFTTable from './components/NFTTable';

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

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const BigTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const NFTActions = styled.div`
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
  const [damageLevel, setDamageLevel] = useState('');
  const web3Provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe]);

  const [nfts, loadingNFTs] = useSafeNFTs(web3Provider, safe.safeAddress);
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
      const signer = await web3Provider.getSigner();
      const contract = new ethers.Contract(contractAddress.contractAddress, web3Mint.abi, signer);
      const res = await client.get(rootCid) // Web3Response
      if (res) {
        const files = await res.files() // Web3File[]
        for (const file of files) {
          console.log("file.cid:", file.cid)
          try {
            const tx = await contract.mintIpfsNFT(imageName, file.cid, imageId, damageLevel);
            await tx.wait();
            console.log('Data has been saved successfully', { imageName, imageId });
          } catch (err) {
            console.error("An error occurred while saving the data", err);
          }
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
      <Header>
        <BigTitle>block-motor</BigTitle>
      </Header>
      <NFTActions>
        <h3>Owned NFTs : {safe.safeAddress}</h3>
        <Button size="md" color="primary" onClick={handleRegister}>
          Register
        </Button>
      </NFTActions>
      <Modal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)}>
        <Title size="xs">Register NFT</Title>
        <TextField
          label="Image Name"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
        />
        <TextField
          label="Damage Level"
          value={damageLevel}
          onChange={(e) => setDamageLevel(e.target.value)}
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

      {loadingNFTs ? (
        <p>Loading NFTs...</p>
      ) : (
        <>
          <NFTTable nfts={nfts} />
        </>
      )}
    </Container >
  );
};

export default SafeApp;