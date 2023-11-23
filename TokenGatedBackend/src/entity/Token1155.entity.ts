import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';
import { Asset1155Entity } from './Asset1155.entity';
import { ContractEntity } from './Contract.entity';

@Entity('Tokens1155')
export class Token1155Entity extends PVBaseEntity {
    @Column({ length: 16 })
    tokenId: string;

    @Column({ type: 'integer' })
    supply: number;

    @Column({ type: 'integer' })
    maxSupply: number;

    @Column({ type: 'uuid' })
    contractId: string;

    @Column({ length: 128 })
    name: string;

    @Column({ length: 1024 })
    description: string;

    @Column({ length: 256 })
    image: string;

    @Column({ length: 256 })
    animation: string;

    @OneToMany(() => Asset1155Entity, (asset1155) => asset1155['token1155'])
    assets1155: Array<Asset1155Entity>;

    @ManyToOne(() => ContractEntity, (contract) => contract['tokens1155'])
    contract: ContractEntity;
}
