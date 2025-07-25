import type { Unit } from '../entities/unit.enitity';
import { compoundResponse } from './compound.response';

export function unitWithCompoundResponse(unit: Unit) {
  return {
    id: unit.id,
    name: unit.name,
    compound: compoundResponse(unit.compound),
  };
}
