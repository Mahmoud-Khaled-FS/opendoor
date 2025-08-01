import { Entity, ManyToOne, Property, t, type Rel } from '@mikro-orm/core';
import { Unit } from './unit.entity';
import { User } from '../../user/entities/user.entity';
import { Status } from '../../../core/constant/status.enum';
import { UserUnitRole } from '../constant/userUnitRole.enum';

@Entity()
export class UnitUser {
  @ManyToOne(() => Unit)
  unit!: Rel<Unit>;

  @ManyToOne(() => User)
  user!: Rel<User>;

  @Property({ default: UserUnitRole.OWNER, type: t.string })
  role: UserUnitRole = UserUnitRole.OWNER;

  @Property({ default: Status.SUSPENDED, type: t.smallint })
  status: Status = Status.SUSPENDED;
}
