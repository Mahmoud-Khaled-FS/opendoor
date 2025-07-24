import { Entity, ManyToOne, Property, type Rel } from '@mikro-orm/postgresql';
import BaseEntity from '../../../core/base/entity';
import { Compound } from './compound.entity';

@Entity()
export class CompoundService extends BaseEntity {
  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property({ nullable: true })
  phone?: string;

  @Property()
  category!: string;

  @ManyToOne(() => Compound)
  compound!: Rel<Compound>;
}
