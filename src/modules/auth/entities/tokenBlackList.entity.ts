import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import BaseEntity from '../../../core/base/entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class TokenBlackList extends BaseEntity {
  @Property({ type: 'text' })
  token!: string;

  @Property()
  type!: string;

  @Property()
  exp!: number;

  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user!: User;
}
