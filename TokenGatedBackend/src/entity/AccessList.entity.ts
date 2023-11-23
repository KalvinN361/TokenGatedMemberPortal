import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AccessList')
export class AccessListEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    contractId: string;

    @Column({ length: 64 })
    accessListId: string;
}
