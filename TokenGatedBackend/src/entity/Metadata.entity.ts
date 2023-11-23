import { Column, Entity } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';

@Entity('Metadata')
export class MetadataEntity extends PVBaseEntity {
    @Column({ length: 16 })
    tokenId: string;

    @Column({ length: 256 })
    name: string;

    @Column({ length: 256 })
    description: string;

    @Column({ length: 512 })
    image: string;

    @Column({ length: 512 })
    imageSmall: string;

    @Column({ length: 512 })
    animation: string;

    @Column({ length: 512 })
    animationSmall: string;

    @Column({ type: 'uuid' })
    assetId: string;

    @Column({ type: 'uuid' })
    contractId: string;
}
