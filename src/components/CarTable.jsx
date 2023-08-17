
const NFTTable = ({ nfts }) => {

    return (
        <table>
            <thead>
                <tr>
                    <th>Owner</th>
                    <th>Name</th>
                    <th>Car Unique ID</th>
                    <th>Damage Level</th>
                    <th>Created Time</th>
                    <th>Image</th>

                </tr>
            </thead>
            <tbody>
                {nfts.map(nft => (
                    <tr key={nft.id}>
                        <td>{nft.owner}</td>
                        <td>{nft.name}</td>
                        <td>{nft.car_unique_id}</td>
                        <td>{nft.damage_level}</td>
                        <td>{nft.created_time}</td>
                        <td><img src={nft.imageUrl} alt={nft.name} width="100" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NFTTable;
