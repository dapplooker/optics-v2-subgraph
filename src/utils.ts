import {
    Address,
    BigDecimal,
    BigInt,
} from "@graphprotocol/graph-ts"

import {
    User,
} from "../generated/schema";


export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");


export function createUser(address: string, token: string, blockTimestamp: BigInt): void {
    let user = User.load(address);
    if (!user) {
        user = new User(address);
    }

    user.blockTimestamp = blockTimestamp;
    user.save();

}
