import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll() {
    return this.prisma.user.findMany();
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
