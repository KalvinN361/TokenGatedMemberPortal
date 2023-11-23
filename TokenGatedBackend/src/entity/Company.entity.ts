import { Column, Entity } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';

@Entity('Companies')
export class CompanyEntity extends PVBaseEntity {
    @Column({ length: 256 })
    name: string;

    @Column({ length: 512 })
    description: string;

    @Column({ length: 256 })
    database: string;

    @Column({ length: 64 })
    domain: string;

    @Column({ length: 512 })
    heroImage: string;
}
