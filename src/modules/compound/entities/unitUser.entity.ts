import { Entity, ManyToOne, Property, type Rel } from '@mikro-orm/core';
import { Unit } from './unit.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class UnitUser {
  @ManyToOne(() => Unit)
  unit!: Rel<Unit>;

  @ManyToOne(() => User)
  user!: Rel<User>;

  @Property()
  role: string = 'owner';
}
