import { Collection, Entity, EntityRepositoryType, ManyToMany, OneToMany, Property, t } from '@mikro-orm/postgresql';
import BaseEntity from '../../../core/base/entity';
import BaseRepository from '../../../core/base/repository';
import { Unit } from './unit.entity';
import { CompoundService } from './compoundService.entity';
import { Announcement } from './announcement.entity';

@Entity({ repository: () => BaseRepository })
export class Compound extends BaseEntity {
  [EntityRepositoryType]?: BaseRepository<Compound>;

  @Property()
  name!: string;

  @Property({ type: t.text })
  description?: string;

  @Property()
  image?: string;

  @Property()
  address?: string;

  @Property()
  location?: string;

  @OneToMany(() => Unit, (unit) => unit.compound)
  units = new Collection<Unit>(this);

  @ManyToMany(() => CompoundService)
  services = new Collection<CompoundService>(this);

  @OneToMany(() => Announcement, (announcement) => announcement.compound)
  announcements = new Collection<Announcement>(this);
}
