import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { PVBaseEntity } from './PVBase.entity';
import { RefreshTokenEntity } from './RefreshToken.entity';
import { AssetEntity } from './Asset.entity';
import { Asset1155Entity } from './Asset1155.entity';

@Entity('Owners')
export class OwnerEntity extends PVBaseEntity {
    @Column({ nullable: true, length: 64 })
    walletAddress: string;

    @Column({ enum: [1, 5, 137, 8001], default: 1 })
    chainId: number;

    @Column({ nullable: true, length: 128 })
    userName: string;

    @Column({ nullable: true, length: 128 })
    firstName: string;

    @Column({ nullable: true, length: 128 })
    lastName: string;

    @Column({ nullable: true, length: 128 })
    email: string;

    @Column({ nullable: false, length: 32 })
    type: string;

    @Column({ nullable: false, length: 32 })
    role: string;

    @OneToMany(() => AssetEntity, (asset) => asset['owner'])
    assets: Array<AssetEntity>;

    @OneToMany(() => Asset1155Entity, (assets1155) => assets1155['owner'])
    assets1155: Array<AssetEntity>;

    @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.owner)
    refreshToken?: RefreshTokenEntity;
}
