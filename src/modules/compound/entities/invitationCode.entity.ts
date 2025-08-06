import { Entity, ManyToOne, Property, type Rel } from '@mikro-orm/postgresql';
import BaseEntity from '../../../core/base/entity';
import { Compound } from './compound.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class CompoundInvitationCode extends BaseEntity {
  @Property({ unique: true, index: true })
  code!: string;

  @ManyToOne(() => Compound, { primary: true, deleteRule: 'cascade' })
  compound!: Rel<Compound>;

  @ManyToOne(() => User, { primary: true, deleteRule: 'cascade' })
  user!: Rel<User>;
}
