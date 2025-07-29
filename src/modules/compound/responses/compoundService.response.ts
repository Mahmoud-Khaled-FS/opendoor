import type { CompoundService } from '../entities/compoundService.entity';

export function compoundServiceResponse(service: CompoundService) {
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    phone: service.phone,
    category: service.category,
  };
}
