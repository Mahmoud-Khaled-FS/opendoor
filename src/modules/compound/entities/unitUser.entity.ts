import { Entity, ManyToOne, Property, t, type Rel } from '@mikro-orm/core';
import { Unit } from './unit.entity';
import { User } from '../../user/entities/user.entity';
import { UserUnitRole } from '../constant/userUnitRole.enum';

@Entity()
export class UnitUser {
  @ManyToOne(() => Unit, { primary: true })
  unit!: Rel<Unit>;

  @ManyToOne(() => User, { primary: true })
  user!: Rel<User>;

  @Property({ default: UserUnitRole.OWNER, type: t.string })
  role: UserUnitRole = UserUnitRole.OWNER;

  @Property({ default: 'active', type: t.string })
  status: 'active' | 'suspended' = 'active';
}
