import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/role.descorator';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from 'src/interfaces/user.interface';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth/jwt-auth.guard';

@Controller('/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() createUser: CreateUserDto) {
    return await this.userService.create(createUser);
  }

  @Get()
  async findAll(@Request() req): Promise<[User[], number]> {
    console.log(req);

    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return this.userService.find(req.user.id);
  }

  @Get('/:id')
  async find(@Param('id') id: string): Promise<User> {
    return this.userService.find(id);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string): Promise<string> {
    return this.userService.delete(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() user: CreateUserDto,
  ): Promise<string> {
    return await this.userService.update(id, user);
  }
}
