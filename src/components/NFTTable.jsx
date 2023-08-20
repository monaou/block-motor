import { Button } from '@gnosis.pm/safe-react-components';
import { Link } from 'react-router-dom';
import './NFTTable.css';

const NFTTable = ({ nfts }) => {

    return (
        <table>
            <thead>
                <tr>
                    <th>Token Id</th>
                    <th>Name</th>
                    <th>Car Unique ID</th>
                    <th>Image</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {nfts.map(nft => (
                    <tr key={nft.id}>
                        <td>{nft.id}</td>
                        <td>{nft.name}</td>
                        <td>{`${nft.car_unique_id.slice(0, 6)}...${nft.car_unique_id.slice(-6)}`}</td>
                        <td><img src={nft.imageUrl} alt={nft.name} width="100" /></td>
                        <td>
                            <Link to={`/car/${nft.car_unique_id}`}>
                                <Button size="md" color="primary">
                                    checkCar
                                </Button>
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NFTTable;
