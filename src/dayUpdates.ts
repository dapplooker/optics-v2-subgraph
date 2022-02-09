import {  BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
    TokenTransactions,
    TokenDayData,
} from "../generated/schema";
import { ONE_BI, ZERO_BD, ZERO_BI } from "./utils";


export function updateTokenDayData(token: TokenTransactions, event: ethereum.Event): TokenDayData {
    let timestamp = event.block.timestamp.toI32();
    let dayID = timestamp / 86400;
    let dayStartTimestamp = timestamp - ( timestamp % 86400 );
    let tokenDayID = dayStartTimestamp.toString().concat("-").concat(token.txHash.toHexString());

    let tokenDayData = TokenDayData.load(tokenDayID);
    if (tokenDayData === null) {
        tokenDayData = new TokenDayData(tokenDayID);
        tokenDayData.date = dayStartTimestamp;
        tokenDayData.token = token.txHash;
        tokenDayData.dailyVolumeToken = ZERO_BD;
        tokenDayData.dailyGasConsumed = ZERO_BD;
        tokenDayData.dailyTxns = ZERO_BI;
    }

    tokenDayData.dailyTxns = tokenDayData.dailyTxns.plus(ONE_BI);
    tokenDayData.save();

    return tokenDayData as TokenDayData;
}
