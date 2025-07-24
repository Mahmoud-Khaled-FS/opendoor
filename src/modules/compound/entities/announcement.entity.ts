import { Entity, ManyToOne, Property, type Rel } from '@mikro-orm/postgresql';
import BaseEntity from '../../../core/base/entity';
import { Compound } from './compound.entity';

@Entity()
export class Announcement extends BaseEntity {
  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property()
  type!: 'normal' | 'voting';

  @Property({ type: 'json', nullable: true })
  answers?: any;

  @ManyToOne(() => Compound)
  compound!: Rel<Compound>;
}
