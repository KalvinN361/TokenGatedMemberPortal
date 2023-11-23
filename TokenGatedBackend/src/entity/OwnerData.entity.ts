import { Entity, Column } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';

@Entity('OwnerData')
export class OwnerDataEntity extends PVBaseEntity {
    @Column({ length: 128 })
    firstName: string;

    @Column({ length: 128 })
    lastName: string;

    @Column({ length: 258 })
    email: string;

    @Column()
    phoneNumber: string;

    @Column()
    address1: string;

    @Column()
    address2: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column()
    postalCode: string;

    @Column()
    ownerId: string;
}
