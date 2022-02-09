import {
  Transfer as TransferEvent,
} from "../generated/cUSD/ERC20"
import {
    Transaction as Transaction,
    Token as Token
} from "../generated/schema"
import { log } from "@graphprotocol/graph-ts";
import {
    createUser,
} from "./utils";
import {
    updateTokenDayData
} from "./dayUpdates"

let OPTICS_CELO_ADDRESS = "0x1548cf5cf7dBd93f4dA11f45fCce315573d21B60";


export function handleTransferEvent(event: TransferEvent): void {
    let _token_to = event.transaction.to
    //@ts-ignore
    if (event.transaction.from.toHexString() == OPTICS_CELO_ADDRESS || (_token_to && _token_to.toHexString() == OPTICS_CELO_ADDRESS)) {
        let tokenTransactionIdentifier = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

        let token = Token.load(event.address.toHexString());
        if (!token){
            token = new Token(event.address.toHexString());
            token.save();
        }

        log.info("handleTransferEvent::inside transaction identifier = {}", [tokenTransactionIdentifier]);
        let transaction = new Transaction(tokenTransactionIdentifier);

        transaction.txHash = event.transaction.hash;
        transaction.token = token.id;
        transaction.fromAddress = event.transaction.from;
        transaction.toAddress = event.transaction.to;
        transaction.gasUsed = event.transaction.gasLimit;
        transaction.gasPrice = event.transaction.gasPrice;
        transaction.blockTimestamp = event.block.timestamp;
        transaction.from = event.params.from;
        transaction.to = event.params.to;
        transaction.value = event.params.value;

        log.info("handleTransferEvent: block number: {}", [event.block.number.toString()]);
        createUser(event.params.from.toHexString(), token, event.block.timestamp);
        createUser(event.params.to.toHexString(), token, event.block.timestamp);

        let tokenDayData = updateTokenDayData(transaction, event);

        tokenDayData.save();

        transaction.save();
    }
}
