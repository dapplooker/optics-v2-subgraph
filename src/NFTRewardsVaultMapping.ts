import {
  Transfer as TransferEvent,
} from "../generated/NFTRewardsVault/NFTRewardsVault"
import {} from "../generated/NFTRewardsVault/NFTRewardsVault"
import {
  NFTRewardsVaultTransferEvent as NFTRewardsVaultTransferEventSchema,
} from "../generated/schema"
import {} from "../generated/schema"

export function handleTransferEvent(event: TransferEvent): void {
    let entity = new NFTRewardsVaultTransferEventSchema(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    )

    entity.txHash = event.transaction.hash
    entity.fromAddress = event.transaction.from
    entity.toAddress = event.transaction.to
    entity.valueTransferred = event.transaction.value
    entity.gasUsed = event.transaction.gasLimit
    entity.gasPrice = event.transaction.gasPrice
    entity.blockTimestamp = event.block.timestamp
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.save()
}
