import { Column, Entity } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';

@Entity('Queues')
export class QueueEntity extends PVBaseEntity {
    @Column()
    position: number;

    @Column({ type: 'uuid' })
    ownerId: string;

    @Column({ type: 'uuid' })
    eventId: string;

    @Column({ type: 'boolean' })
    hold: boolean;

    @Column({ length: 16 })
    status: 'Waiting' | 'Spinning' | 'WaitingSpin' | 'Finished';

    @Column({ length: 256 })
    transactionType: string;
}
