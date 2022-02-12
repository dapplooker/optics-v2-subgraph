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

let OPTICS_CELO_ADDRESS = 0x1548cf5cf7dBd93f4dA11f45fCce315573d21B60;


export function handleTransferEvent(event: TransferEvent): void {
    log.info("handleTransferEvent transaction identifier from {}, type {}", [event.params.from.toString(), typeof event.params.from]);
    log.info("handleTransferEvent transaction identifier to {}, type {}", [event.params.to.toString(), typeof event.params.to]);
    log.info("handleTransferEvent optics typeof {}", [typeof OPTICS_CELO_ADDRESS]);

    if (event.params.from.toString() == OPTICS_CELO_ADDRESS.toString() ||
        event.params.to.toHexString() == OPTICS_CELO_ADDRESS.toString()) {
        let token = Token.load(event.address.toHexString());
        if (!token){
            token = new Token(event.address.toHexString());
            token.save();
        }

        log.info("Working on block: {}", [event.block.number.toString()]);

        let tokenTransactionIdentifier = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

        log.info("This a optics token transaction, identifier = {}", [tokenTransactionIdentifier]);
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
        log.info("Creating user for transaction address: {}", [event.transaction.hash.toHex()]);
        createUser(event.params.from, token.id, event.block.timestamp);
        createUser(event.params.to, token.id, event.block.timestamp);

        let tokenDayData = updateTokenDayData(transaction, event);
        tokenDayData.save();
        transaction.save();
    }
}
