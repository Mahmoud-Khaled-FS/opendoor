import { Collection, Entity, EntityRepositoryType, ManyToMany, OneToMany, Property } from '@mikro-orm/postgresql';
import BaseEntity from '../../../core/base/entity';
import BaseRepository from '../../../core/base/repository';
import { Unit } from '../../compound/entities/unit.entity';
import { Invitation } from '../../invitation/entities/invitation.entity';
import { UnitUser } from '../../compound/entities/unitUser.entity';

@Entity({ repository: () => BaseRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: BaseRepository<User>;

  @Property()
  fullName!: string;

  @Property({ unique: true })
  phone!: string;

  @Property()
  email?: string | null;

  @Property({ lazy: true })
  password!: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property({ default: 'active' })
  status: string = 'active';

  @ManyToMany(() => Unit, (unit) => unit.users, { pivotEntity: () => UnitUser })
  units = new Collection<Unit>(this);

  @OneToMany(() => UnitUser, (unitUser) => unitUser.user)
  unitUsers = new Collection<UnitUser>(this);

  @OneToMany(() => Invitation, (invitation) => invitation.inviter)
  invitations = new Collection<Invitation>(this);
}
