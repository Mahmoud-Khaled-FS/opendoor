import type { Compound } from '../entities/compound.entity';

export function compoundResponse(compound: Compound) {
  return {
    id: compound.id,
    name: compound.name,
    description: compound.description,
    image: compound.image,
    address: compound.address,
    location: compound.location,
  };
}
