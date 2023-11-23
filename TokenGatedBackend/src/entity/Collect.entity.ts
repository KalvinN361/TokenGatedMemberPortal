import { Column, Entity } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';

@Entity('Collects')
export class CollectEntity extends PVBaseEntity {
    @Column({ length: 32 })
    shortName: string;

    @Column({ length: 64 })
    name: string;

    @Column({ length: 1024 })
    description: string;

    @Column({ length: 1024 })
    bgImage: string;
}
