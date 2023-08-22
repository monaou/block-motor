import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import web3Mint from '../shared_json/Web3Mint.json';
import contractAddress from '../shared_json/contractAddress.json';
type NFT = {
    id: number;
    name: string;
    car_unique_id: string;
    damage_level: string;
    created_time: string;
    owner: string;
    imageUrl: string;
};
const useSafeCars = (web3Provider: ethers.providers.Web3Provider, safeAddress: string, carUniqueId: string): [NFT[], boolean] => {
    const [nfts, setNFTs] = useState<NFT[]>([]);
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

                const fetchedNFTPromises = balance.map(async (tokenId: ethers.BigNumber) => {
                    const tokenURI = await contract.tokenURI(tokenId.toNumber());

                    // Remove the prefix from the tokenURI
                    const base64String = tokenURI.replace('data:application/json;base64,', '');
                    const jsonString = atob(base64String);
                    const metaDataObj = JSON.parse(jsonString);
                    const date = new Date(metaDataObj.created_time * 1000);
                    const formattedDateTime = date.toLocaleString('ja-JP');

                    return {
                        id: tokenId.toNumber(),
                        name: metaDataObj.name,
                        car_unique_id: metaDataObj.car_unique_id,
                        damage_level: metaDataObj.damageLevel,
                        created_time: formattedDateTime,
                        owner: metaDataObj.owner,
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

    }, [web3Provider, safeAddress, carUniqueId]);

    return [nfts, loading];
};

export default useSafeCars;
