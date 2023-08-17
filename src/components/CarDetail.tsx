import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@gnosis.pm/safe-react-components';
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

const Header = styled.div`
  width: 100%;
  display: flex;               // flex-directionをcolumnから削除
  align-items: center;         // flex-startからcenterに変更
  justify-content: space-between;  // タイトルとボタンを両端に配置
  margin-bottom: 1rem;
`;

const HomeButtonContainer = styled.div` // 新しいstyled component
  display: flex;
  align-items: center;
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

const CarDetailPage: React.FC = () => {
    const { sdk, safe } = useSafeAppsSDK();
    const web3Provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe]);
    const { carUniqueId } = useParams<{ carUniqueId: string }>();

    const [nfts, loadingNFTs] = useSafeCars(web3Provider, safe.safeAddress, carUniqueId || '');
    const navigate = useNavigate();  // useNavigateを使って、navigate関数を取得

    return (
        <Container>
            <Header>
                <BigTitle>block-motor</BigTitle>
                <HomeButtonContainer>
                    <Button size="md" color="secondary" onClick={() => navigate('/')}>
                        Home
                    </Button>
                </HomeButtonContainer>
            </Header>

            <NFTActions>
                <h3>Car Details : {carUniqueId}</h3>
                <Button size="md" color="primary">
                    Check Status
                </Button>
            </NFTActions>
            {loadingNFTs ? (
                <p>Loading NFTs...</p>
            ) : (
                <>
                    <CarTable nfts={nfts} />
                </>
            )}
        </Container >
    );
};

export default CarDetailPage;