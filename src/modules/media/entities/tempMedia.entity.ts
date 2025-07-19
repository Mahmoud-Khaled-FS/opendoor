import { Entity, ManyToOne, Property } from '@mikro-orm/postgresql';
import BaseEntity from '../../../core/base/entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class TempMedia extends BaseEntity {
  @Property({ nullable: true })
  session?: string;

  @Property()
  uuid!: string;

  @Property()
  path!: string;

  @ManyToOne(() => User)
  user?: User;
}
