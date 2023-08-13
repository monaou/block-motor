// NFTTable.jsx
import React from 'react';
import { Button } from '@gnosis.pm/safe-react-components';

const NFTTable = ({ nfts }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Car Type Id</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {nfts.map(nft => (
                    <tr key={nft.id}>
                        <td>{nft.id}</td>
                        <td>{nft.name}</td>
                        <td>{nft.description}</td>
                        <td><img src={nft.imageUrl} alt={nft.name} width="100" /></td>
                        <td><Button size="md" color="primary">
                            checkCar
                        </Button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NFTTable;
