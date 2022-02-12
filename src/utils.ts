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


export function createUser(address: Address, token: string, blockTimestamp: BigInt): void {
    let userIdentifier = address.toHexString().concat("-").concat(token)
    let user = User.load(userIdentifier);
    if (!user) {
        user = new User(address.toHexString());
        user.user = address
        user.token = token;
    }

    user.blockTimestamp = blockTimestamp;
    user.save();
}