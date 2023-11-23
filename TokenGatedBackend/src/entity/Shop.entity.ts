import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';
import { AssetEntity } from './Asset.entity';

@Entity('Shops')
export class ShopEntity extends PVBaseEntity {
    @Column({ type: 'uuid' })
    assetId: string;

    @Column({ length: 16 })
    type: string;

    @Column({ type: 'numeric' })
    price: number;

    @OneToOne(() => AssetEntity, (asset) => asset['shop'])
    @JoinColumn({ name: 'assetId' })
    asset: AssetEntity;
}
