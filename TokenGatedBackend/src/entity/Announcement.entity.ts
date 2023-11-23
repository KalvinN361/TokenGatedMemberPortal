import { Column, Entity, OneToMany } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';

@Entity('Announcements')
export class AnnouncementEntity extends PVBaseEntity {
    @Column({ nullable: false, length: 32 })
    type: string;

    @Column({ nullable: true, length: 64 })
    subject: string;

    @Column()
    description: string;

    @Column({ nullable: false, type: 'timestamp' })
    startDate: Date;

    @Column({ nullable: false, type: 'timestamp' })
    endDate: Date;
}
