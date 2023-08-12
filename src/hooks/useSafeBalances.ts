import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import web3Mint from './../shared_json/Web3Mint.json';
import contractAddress from './../shared_json/contractAddress.json';

// web3ProviderとsafeAddressを引数として受け取るように変更
const useSafeNFTs = (web3Provider: ethers.providers.Web3Provider, safeAddress: string): [any[], boolean] => {
    const [nfts, setNFTs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                    nftIds.push(tokenId);
                }

                // If you want to fetch more details about each NFT, you can use the above nftIds and call other contract methods

                setNFTs(nftIds);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching NFTs:", error);
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [web3Provider, safeAddress]);

    return [nfts, loading];
};

export default useSafeNFTs;
