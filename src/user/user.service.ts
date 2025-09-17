import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { findOrFail } from 'src/common/queries/query-utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async findAll(): Promise<[User[], number]> {
    return await this.userRepo.findAndCount();
  }

  async find(id: string): Promise<User> {
    const user = await findOrFail(this.userRepo, id, 'User');
    return user;
  }

  async update(id: string, createUserDto: CreateUserDto): Promise<string> {
    await findOrFail(this.userRepo, id, 'User');

    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    await this.userRepo.update(id, createUserDto);
    return id;
  }

  async delete(id: string): Promise<string> {
    await findOrFail(this.userRepo, id, 'User');

    await this.userRepo.delete(id);
    return id;
  }
}
