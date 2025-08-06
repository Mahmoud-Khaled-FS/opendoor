import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
  type Rel,
} from '@mikro-orm/postgresql';
import BaseEntity from '../../../core/base/entity';
import BaseRepository from '../../../core/base/repository';
import { Compound } from './compound.entity';
import { User } from '../../user/entities/user.entity';
import { UnitUser } from './unitUser.entity';

@Entity({ repository: () => BaseRepository })
export class Unit extends BaseEntity {
  [EntityRepositoryType]?: BaseRepository<Unit>;

  @Property()
  name!: string;

  @ManyToOne(() => Compound, { deleteRule: 'cascade' })
  compound!: Rel<Compound>;

  @ManyToMany({ entity: () => User, pivotEntity: () => UnitUser })
  users = new Collection<User>(this);

  @OneToMany(() => UnitUser, (unitUser) => unitUser.unit)
  unitUsers = new Collection<UnitUser>(this);
}
