import type { Unit } from '../entities/unit.entity';
import { compoundResponse } from './compound.response';

export function unitWithCompoundResponse(unit: Unit, user?: any) {
  const pivot = unit.unitUsers.getItems().find(uu => uu.user.id === user?.id) ?? null;
  return {
    id: unit.id,
    name: unit.name,
    role: pivot?.role,
    compound: compoundResponse(unit.compound),
  };
}
