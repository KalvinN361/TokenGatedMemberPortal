import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { OwnerEntity } from './Owner.entity';
import { PVBaseEntity } from './PVBase.entity';

@Entity('RefreshTokens')
export class RefreshTokenEntity extends PVBaseEntity {
    @Column()
    token: string;

    @Column()
    version: number;

    @OneToOne(() => OwnerEntity)
    @JoinColumn()
    owner: OwnerEntity;
}
