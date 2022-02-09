import {
    Transfer as TransferEvent,
} from "../generated/cUSD/ERC20"
import {
    Transaction,
    TokenDayData,
} from "../generated/schema";
import { ONE_BI, ZERO_BD, ZERO_BI } from "./utils";


export function updateTokenDayData(token: Transaction, event: TransferEvent): TokenDayData {
    let timestamp = event.block.timestamp.toI32();
    let dayStartTimestamp = timestamp - ( timestamp % 86400 );
    let tokenDayID = dayStartTimestamp.toString().concat("-").concat(event.address.toHexString());

    let tokenDayData = TokenDayData.load(tokenDayID);
    if (tokenDayData === null) {
        tokenDayData = new TokenDayData(tokenDayID);
        tokenDayData.date = dayStartTimestamp;
        tokenDayData.token = token.id;
        tokenDayData.dailyVolumeToken = ZERO_BD;
        tokenDayData.dailyGasConsumed = ZERO_BD;
        tokenDayData.dailyTxns = ZERO_BI;
    }

    tokenDayData.dailyVolumeToken = tokenDayData.dailyVolumeToken.plus(event.params.value.toBigDecimal());
    let gasConsumed = event.transaction.gasLimit.times(event.transaction.gasPrice).toBigDecimal();
    tokenDayData.dailyGasConsumed = tokenDayData.dailyGasConsumed.plus(gasConsumed);

    tokenDayData.dailyTxns = tokenDayData.dailyTxns.plus(ONE_BI);
    tokenDayData.save();

    return tokenDayData as TokenDayData;
}
