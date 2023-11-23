import { Column, Entity } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';

@Entity('Events')
export class EventEntity extends PVBaseEntity {
    @Column({ length: 256 })
    name: string;

    @Column({ length: 256 })
    description: string;

    @Column()
    date: Date;
}
