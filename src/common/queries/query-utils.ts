import { NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

export async function findOrFail<T extends ObjectLiteral>(
  repo: Repository<T>,
  id: string,
  entityName = 'Entity',
): Promise<T> {
  const entity = await repo.findOne({ where: { id } as any });

  if (!entity) {
    throw new NotFoundException(`${entityName} with ID ${id} not found`);
  }

  return entity;
}
