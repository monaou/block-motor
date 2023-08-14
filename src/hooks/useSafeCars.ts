import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import web3Mint from '../shared_json/Web3Mint.json';
import contractAddress from '../shared_json/contractAddress.json';

const useSafeCars = (web3Provider: ethers.providers.Web3Provider, safeAddress: string, carUniqueId: string): [any[], boolean] => {
    const [nfts, setNFTs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!carUniqueId) {
            return;
        }

        let isMounted = true;  // 新しいフラグを追加

        const fetchNFTs = async () => {
            try {
                const signer = await web3Provider.getSigner();
                const contract = new ethers.Contract(contractAddress.contractAddress, web3Mint.abi, signer);
                const balance = await contract.getTokensByCarId(carUniqueId);
                console.log(balance)

                const fetchedNFTPromises = balance.map(async (tokenId: any) => {
                    const tokenURI = await contract.tokenURI(tokenId.toNumber());

                    // Remove the prefix from the tokenURI
                    const base64String = tokenURI.replace('data:application/json;base64,', '');
                    const jsonString = atob(base64String);
                    const metaDataObj = JSON.parse(jsonString);

                    return {
                        id: tokenId.toNumber(),
                        name: metaDataObj.name,
                        car_unique_id: metaDataObj.car_unique_id,
                        imageUrl: metaDataObj.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                    };
                });
                const fetchedNFTs = await Promise.all(fetchedNFTPromises);

                if (isMounted) {  // isMountedフラグでチェック
                    setNFTs(fetchedNFTs);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching NFTs:", error);
                if (isMounted) {  // isMountedフラグでチェック
                    setLoading(false);
                }
            }
        };

        fetchNFTs();

        return () => {
            isMounted = false;  // クリーンアップ関数でフラグをfalseに設定
        };

    }, [web3Provider, safeAddress]);

    return [nfts, loading];
};

export default useSafeCars;
