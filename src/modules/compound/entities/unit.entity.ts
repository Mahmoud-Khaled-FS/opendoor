import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  ManyToOne,
  Property,
  t,
  type Rel,
} from '@mikro-orm/postgresql';
import BaseEntity from '../../../core/base/entity';
import BaseRepository from '../../../core/base/repository';
import { Compound } from './compound.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ repository: () => BaseRepository })
export class Unit extends BaseEntity {
  [EntityRepositoryType]?: BaseRepository<Unit>;

  @Property({ unique: true })
  name!: string;

  @ManyToOne(() => Compound, { deleteRule: 'cascade' })
  compound!: Rel<Compound>;

  @ManyToMany(() => User)
  users = new Collection<User>(this);
}
