import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';
import { AttributeEntity } from './Attribute.entity';
import { ContractEntity } from './Contract.entity';
import { OwnerEntity } from './Owner.entity';
import { ClaimEntity } from './Claim.entity';
import { ShopEntity } from './Shop.entity';

@Entity('Assets')
export class AssetEntity extends PVBaseEntity {
    @Column({ length: 16 })
    tokenId: string;

    @Column({ type: 'uuid' })
    ownerId: string;

    @Column({ type: 'uuid' })
    contractId: string;

    @Column({ length: 64 })
    status: string;

    @Column({ length: 256 })
    name: string;

    @Column()
    description: string;

    @Column({ length: 512 })
    image: string;

    @Column({ length: 512 })
    imageSmall: string;

    @Column({ length: 512 })
    animation: string;

    @Column({ length: 512 })
    animationSmall: string;

    @Column()
    reserve: boolean;

    @OneToMany(() => AttributeEntity, (attribute) => attribute['asset'])
    attributes: Array<AttributeEntity>;

    @ManyToOne(() => ContractEntity, (contract) => contract['assets'])
    contract: ContractEntity;

    @ManyToOne(() => OwnerEntity, (owner) => owner['assets'])
    owner: OwnerEntity;

    @OneToOne(() => ClaimEntity, (claim) => claim['asset'])
    claim: ClaimEntity;

    @OneToOne(() => ShopEntity, (shop) => shop['asset'])
    shop: ShopEntity;
}
