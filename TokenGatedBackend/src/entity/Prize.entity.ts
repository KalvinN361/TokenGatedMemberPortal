import { Column, Entity } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';

@Entity('Prizes')
export class PrizeEntity extends PVBaseEntity {
    @Column()
    slot: number;

    @Column({ length: 256 })
    name: string;

    @Column({ length: 1024 })
    description: string;

    @Column({ type: 'uuid' })
    ownerId: string;

    @Column({ type: 'uuid' })
    eventId: string;

    @Column({ default: false })
    claimed: boolean;

    @Column({ length: 256 })
    image: string;

    @Column({ length: 256 })
    type: 'ERC20' | 'ERC721' | 'ERC1155';

    @Column({ length: 16 })
    tokenId: string;

    @Column({ length: 64 })
    contractAddress: string;

    @Column({ default: false })
    hold: boolean;

    @Column({ length: 256 })
    transactionType: string;
}
