import { useParams } from 'react-router-dom';
import { Title, Button } from '@gnosis.pm/safe-react-components';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';
import { ethers } from 'ethers';
import CarTable from './../components/CarTable';
import useSafeCars from './../hooks/useSafeCars';

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const CarDetailPage: React.FC = () => {
    const { sdk, safe } = useSafeAppsSDK();
    const web3Provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe]);
    const { carUniqueId } = useParams<{ carUniqueId: string }>();

    const [nfts, loadingNFTs] = useSafeCars(web3Provider, safe.safeAddress, carUniqueId || '');

    return (
        <Container>
            <Title size="sm">Wallet: {safe.safeAddress}</Title>
            {loadingNFTs ? (
                <p>Loading NFTs...</p>
            ) : (
                <>
                    <h3>Car NFTs:</h3>
                    <Button size="md" color="primary">
                        Check Status
                    </Button>
                    <CarTable nfts={nfts} />
                </>
            )}
        </Container >
    );
};

export default CarDetailPage;