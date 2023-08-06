import React, { useState } from 'react';
import styled from 'styled-components';
import { Title, TextField, Button } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { useSafeBalances } from './hooks/useSafeBalances';
import BalancesTable from './components/BalancesTable';
import Modal from 'react-modal';

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
  const [balances] = useSafeBalances(sdk);

  const handleRegister = () => {
    setModalOpen(true);
  };

  const handleSave = () => {
    // NFTミントのロジックをここに追加
    console.log("Minting NFT with name:", imageName);
    setModalOpen(false);
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
        {/* 画像アップロードのコンポーネントを追加 */}
        <Button size="md" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal>

      <BalancesTable balances={balances} />
    </Container >
  );
};

export default SafeApp;