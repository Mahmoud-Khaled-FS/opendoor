import Hash from './core/utils/hash';
import { db } from './db';
import { Announcement } from './modules/compound/entities/announcement.entity';
import { Compound } from './modules/compound/entities/compound.entity';
import { CompoundService } from './modules/compound/entities/compoundService.entity';
import { Unit } from './modules/compound/entities/unit.entity';
import { User } from './modules/user/entities/user.entity';

export async function seeder() {
  const $db = db();
  const compound = new Compound();
  compound.name = 'Test Compound';
  compound.description = 'This is a test compound';
  compound.address = '123 Main St, Anytown, USA';
  compound.location = 'Anytown, USA';
  const unit = new Unit();
  unit.name = 'Test Unit';
  compound.units.add(unit);
  const user = new User();
  user.fullName = 'Test User';
  user.phone = '01234567239';
  user.email = '9n6o0@example.com';
  user.password = await Hash.make('password');
  unit.users.add(user);
  const service = new CompoundService();
  service.title = 'Test Service';
  service.description = 'This is a test service';
  service.category = 'emergency';
  service.phone = '01234567899';
  service.compound = compound;
  compound.services.add(service);
  const announcement = new Announcement();
  announcement.title = 'Test Announcement';
  announcement.type = 'voting';
  announcement.description = 'This is a test announcement';
  announcement.answers = [
    { text: 'Option 1', votes: 0 },
    { text: 'Option 2', votes: 0 },
    { text: 'Option 3', votes: 0 },
  ];
  compound.announcements.add(announcement);
  await $db.persistAndFlush(compound);
  await $db.persistAndFlush(unit);
  await $db.persistAndFlush(user);
  await $db.persistAndFlush(service);
  await $db.persistAndFlush(announcement);
}
