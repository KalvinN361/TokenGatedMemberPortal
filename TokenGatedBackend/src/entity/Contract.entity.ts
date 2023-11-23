import { Column, Entity, OneToMany } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';
import { AssetEntity } from './Asset.entity';
import { Token1155Entity } from './Token1155.entity';

@Entity('Contracts')
export class ContractEntity extends PVBaseEntity {
    @Column({ nullable: true, length: 256 })
    description: string;

    @Column({ nullable: true, length: 64 })
    symbol?: string;

    @Column({ length: 64 })
    address: string;

    @Column({ enum: ['ERC20', 'ERC721', 'ERC1155'], default: 'ERC721' })
    type: string;

    @Column({ enum: ['custom', 'hypermint', 'aspen'], default: 'hypermint' })
    minter: string;

    @Column({ enum: [1, 5, 137, 8001], default: 1 })
    chainId: number;

    @Column({ length: 512 })
    chainURL: string;

    @Column({ length: 256 })
    chainAPIKey: string;

    @Column({ type: 'uuid' })
    partnerContractId?: string;

    @Column({ type: 'jsonb' })
    abi: string;

    @Column({ length: 512 })
    deployedBlock: string;

    @Column({ default: false })
    burnable: boolean;

    @Column({ length: 64, nullable: true })
    burnNow: string;

    @Column()
    maxSupply?: number;

    @OneToMany(() => AssetEntity, (asset) => asset['contract'])
    assets: Array<AssetEntity>;

    @OneToMany(() => Token1155Entity, (token1155) => token1155['contract'])
    tokens1155: Array<Token1155Entity>;
}
