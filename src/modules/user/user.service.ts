import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { QdrantService } from '../qdrant/qdrant.service';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private qdrantService: QdrantService,
  ) {}

  async createCollectionForUser(collectionName: string, vectorSize: number) {
    return await this.qdrantService.createCollection(
      collectionName,
      vectorSize,
    );
  }

  async addVectorToCollection(collectionName: string, points: any) {
    return await this.qdrantService.addVectors(collectionName, points);
  }

  async searchVectorsInCollection(collectionName: string, query: any) {
    return await this.qdrantService.searchVectors(collectionName, query);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    return user;
  }

  async findAll(paginationDto: PaginationDto) {
    const { skip, limit } = paginationDto;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      skip,
      limit,
    };
  }

  async find(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, createUserDto: CreateUserDto): Promise<string> {
    const existingUser = await this.ensureUserExists(id);

    const updatedData = { ...createUserDto };
    if (createUserDto.password) {
      updatedData.password = await this.hashPassword(createUserDto.password);
    }

    await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return id;
  }

  async delete(id: string): Promise<string> {
    await this.ensureUserExists(id);
    await this.prisma.user.delete({ where: { id } });
    return id;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async ensureUserExists(id: string) {
    const user = await this.find(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
