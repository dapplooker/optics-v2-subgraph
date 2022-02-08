import {
  Transfer as TransferEvent,
} from "../generated/NFTRewardsVault/NFTRewardsVault"
import {} from "../generated/NFTRewardsVault/NFTRewardsVault"
import {
    TokenTransactions as Token,
} from "../generated/schema"
import { log } from "@graphprotocol/graph-ts";
import {
    createUser,
} from "./utils";
import {
    updateTokenDayData
} from "./dayUpdates"


export function handleTransferEvent(event: TransferEvent): void {
    let tokenIdentifier = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    // let token = Token.load(tokenIdentifier);
    // if (!token) {

    log.info("handleTransferEvent::inside token identifier = {}",[tokenIdentifier]);
    let token = new Token(tokenIdentifier)

    token.txHash = event.transaction.hash
    token.fromAddress = event.transaction.from
    token.toAddress = event.transaction.to
    token.gasUsed = event.transaction.gasLimit
    token.gasPrice = event.transaction.gasPrice
    token.blockTimestamp = event.block.timestamp
    token.from = event.params.from
    token.to = event.params.to
    token.value = event.params.value

    log.info("handleTransferEvent: block number: {}",[event.block.number.toString()]);
    createUser(event.parameters[0].value.toAddress(), event.address.toHexString(), event.block.timestamp);

    let tokenDayData = updateTokenDayData(token as Token, event);

    tokenDayData.save();
    token.save();
}
