import { Column, Entity } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';

@Entity('ChiveBars')
export class ChiveBarsEntity extends PVBaseEntity {
    @Column()
    email: string;

    @Column()
    type: string;

    @Column()
    qtyRemaining: number;
}
