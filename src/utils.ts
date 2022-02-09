import {
    Address,
    BigDecimal,
    BigInt,
} from "@graphprotocol/graph-ts"

import {
    User,
} from "../generated/schema";
import {
    Token as Token
} from "../generated/schema"

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");


export function createUser(address: string, token: Token, blockTimestamp: BigInt): void {
    let userID = address.concat("-").concat(token.id.toString())
    let user = User.load(userID);
    if (!user) {
        user = new User(userID);
    }
    user.token = token.id
    user.blockTimestamp = blockTimestamp;
    user.save();

}
