import { Column, Entity, ManyToOne } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';
import { AssetEntity } from './Asset.entity';

@Entity('Attributes')
export class AttributeEntity extends PVBaseEntity {
    @Column({ length: 64 })
    traitType: string;

    @Column({ type: 'text', nullable: true })
    value: string;

    @Column({ type: 'uuid' })
    metadataId?: string;

    @Column({ type: 'uuid' })
    assetId: string;

    @ManyToOne(() => AssetEntity, (asset) => asset.attributes)
    asset: AssetEntity;
}
