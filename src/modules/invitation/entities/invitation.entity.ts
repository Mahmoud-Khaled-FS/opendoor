import { Entity, ManyToOne, Property, type Rel } from '@mikro-orm/postgresql';
import BaseEntity from '../../../core/base/entity';
import { User } from '../../user/entities/user.entity';
import { Unit } from '../../compound/entities/unit.entity';
import { Compound } from '../../compound/entities/compound.entity';

@Entity()
export class Invitation extends BaseEntity {
  @ManyToOne(() => User)
  inviter!: Rel<User>;

  // @ManyToOne(() => Unit)
  // unit!: Rel<Unit>;

  @Property({ unique: true, index: true })
  token!: string;

  @Property({ nullable: true })
  startAt?: Date;

  @Property({ nullable: true })
  endAt?: Date;

  @Property({ default: 0 })
  scanCount: number = 0;

  @Property({ nullable: true })
  totalScanCount?: number;

  @Property({ nullable: true })
  lastScanAt?: Date;

  @ManyToOne(() => Compound, { nullable: true })
  compound?: Rel<Compound>;

  @Property()
  type: 'one-time' | 'interval' = 'one-time';

  @Property()
  status: 'active' | 'rejected' = 'active';
}
