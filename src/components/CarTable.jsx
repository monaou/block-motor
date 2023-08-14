
const NFTTable = ({ nfts }) => {

    return (
        <table>
            <thead>
                <tr>
                    <th>Token Id</th>
                    <th>Owner</th>
                    <th>Name</th>
                    <th>Car Unique ID</th>
                    <th>Image</th>

                </tr>
            </thead>
            <tbody>
                {nfts.map(nft => (
                    <tr key={nft.id}>
                        <td>{nft.id}</td>
                        <td>{nft.owner}</td>
                        <td>{nft.name}</td>
                        <td>{nft.car_unique_id}</td>
                        <td><img src={nft.imageUrl} alt={nft.name} width="100" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NFTTable;
