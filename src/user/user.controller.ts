import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guard/role/role.guard';
import { Roles } from 'src/decorators/role.descorator';
import { Role } from 'src/enums/role.enum';

@Controller('/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUser: CreateUserDto) {
    return await this.userService.create(createUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return this.userService.find(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async find(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.find(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<string> {
    return this.userService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() user: CreateUserDto,
  ): Promise<string> {
    return await this.userService.update(id, user);
  }
}
