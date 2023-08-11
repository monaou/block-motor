// import { AbiItem } from 'web3-utils';
import { encodeFunctionCall } from 'web3-eth-abi';
import { BaseTransaction, TokenBalance } from '@safe-global/safe-apps-sdk';
import { ERC_20_ABI } from '../abis/erc20';

function encodeTxData(method: any, recipient: string, amount: string): string {
    return encodeFunctionCall(method, [recipient, amount]);
}

function getTransferTransaction(item: TokenBalance, recipient: string): BaseTransaction {
    if (item.tokenInfo.type === 'NATIVE_TOKEN') {
        return {
            // Send ETH directly to the recipient address
            to: recipient,
            value: item.balance,
            data: '0x',
        };
    }

    return {
        // For other token types, generate a contract tx
        to: item.tokenInfo.address,
        value: '0',
        data: encodeTxData(ERC_20_ABI.transfer, recipient, item.balance),
    };
}

export { getTransferTransaction };
