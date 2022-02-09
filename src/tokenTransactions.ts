import {
  Transfer as TransferEvent,
} from "../generated/NFTRewardsVault/NFTRewardsVault"
import {} from "../generated/NFTRewardsVault/NFTRewardsVault"
import {
    TokenTransactions as Transaction,
} from "../generated/schema"
import { log } from "@graphprotocol/graph-ts";
import {
    createUser,
} from "./utils";
import {
    updateTokenDayData
} from "./dayUpdates"


export function handleTransferEvent(event: TransferEvent): void {
    let tokenTransactionIdentifier = event.transaction.hash.toHex() + "-" + event.logIndex.toString()

    log.info("handleTransferEvent::inside transactions identifier = {}", [tokenTransactionIdentifier]);
    let transactions = new Transaction(tokenTransactionIdentifier)

    transactions.txHash = event.transaction.hash
    transactions.fromAddress = event.transaction.from
    transactions.toAddress = event.transaction.to
    transactions.gasUsed = event.transaction.gasLimit
    transactions.gasPrice = event.transaction.gasPrice
    transactions.blockTimestamp = event.block.timestamp
    transactions.from = event.params.from
    transactions.to = event.params.to
    transactions.value = event.params.value

    log.info("handleTransferEvent: block number: {}",[event.block.number.toString()]);
    // createUser(event.transaction.from.toHexString(), event.address.toHexString(), event.block.timestamp);

    let tokenDayData = updateTokenDayData(transactions, event);

    tokenDayData.save();
    transactions.save();
}
