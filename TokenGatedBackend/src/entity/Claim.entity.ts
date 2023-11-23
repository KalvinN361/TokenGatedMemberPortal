import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';
import { AssetEntity } from './Asset.entity';

@Entity('Claims')
export class ClaimEntity extends PVBaseEntity {
    @Column({ length: 256 })
    name: string;

    @Column({ length: 256 })
    description: string;

    @Column({ length: 16 })
    tokenId: string;

    @Column({ length: 64 })
    orderId: string;

    @Column({ length: 256 })
    url: string;

    @Column({ length: 256 })
    code: string;

    @Column()
    claimed: boolean;

    @Column({ length: 64 })
    type: string;

    @Column({ type: 'uuid' })
    assetId: string;

    @Column({ length: 128 })
    image: string;

    @OneToOne(() => AssetEntity, (asset) => asset.claim)
    @JoinColumn({ name: 'assetId' })
    asset: AssetEntity;
}
