import { Column, Entity } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';
import { MediaMap } from '../definitions';

@Entity('Media')
export class MediaEntity extends PVBaseEntity {
    @Column({ length: 256 })
    name: string;

    @Column({ length: 256 })
    description: string;

    @Column({ length: 256 })
    url: string;

    @Column({ length: 64 })
    type: string;

    @Column({ type: 'jsonb' })
    map: MediaMap;

    @Column({ length: 64 })
    category: string;
}
