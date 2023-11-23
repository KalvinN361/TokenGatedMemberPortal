import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';
import { AttributeEntity } from './Attribute.entity';
import { ContractEntity } from './Contract.entity';
import { OwnerEntity } from './Owner.entity';
import { Token1155Entity } from './Token1155.entity';

@Entity('Assets1155')
export class Asset1155Entity extends PVBaseEntity {
    @Column({ type: 'uuid' })
    token1155Id: string;

    @Column({ type: 'uuid' })
    ownerId: string;

    @Column({ type: 'integer' })
    quantity: number;

    @ManyToOne(() => Token1155Entity, (token1155) => token1155['assets1155'])
    token1155: ContractEntity;

    @ManyToOne(() => OwnerEntity, (owner) => owner['assets1155'])
    owner: OwnerEntity;

    /*    @OneToMany(() => AttributeEntity, (attribute) => attribute['asset'])
        attributes: Array<AttributeEntity>;
    
        @ManyToOne(() => ContractEntity, (contract) => contract['assets'])
        contract: ContractEntity;
    
        @ManyToOne(() => OwnerEntity, (owner) => owner['assets'])
        owner: OwnerEntity;*/
}
