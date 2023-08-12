import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import web3Mint from './../shared_json/Web3Mint.json';
import contractAddress from './../shared_json/contractAddress.json';

const useSafeNFTs = (web3Provider: ethers.providers.Web3Provider, safeAddress: string): [any[], boolean] => {
    const [nfts, setNFTs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;  // 新しいフラグを追加

        const fetchNFTs = async () => {
            try {
                const signer = await web3Provider.getSigner();
                const contract = new ethers.Contract(contractAddress.contractAddress, web3Mint.abi, signer);
                console.log(safeAddress)
                const balance = await contract.balanceOf(safeAddress);
                console.log(balance)

                const nftIds: number[] = [];

                for (let i = 0; i < balance.toNumber(); i++) {
                    const tokenId = await contract.tokenOfOwnerByIndex(safeAddress, i);
                    nftIds.push(tokenId.toNumber());
                }

                if (isMounted) {  // isMountedフラグでチェック
                    setNFTs(nftIds);
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

export default useSafeNFTs;
