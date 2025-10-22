import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guard/role/role.guard';
import { Roles } from 'src/decorators/role.descorator';
import { Role } from 'src/enums/role.enum';
import { PaginationDto } from 'src/dto/pagination.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('collection')
  async createCollection(
    @Body('collectionName') collectionName: string,
    @Body('vectorSize') vectorSize: number,
  ) {
    return await this.userService.createCollectionForUser(
      collectionName,
      vectorSize,
    );
  }

  @Post('collection/vector')
  async createVectorsToCollection(
    @Body('collectionName') collectionName: string,
    @Body('point') points: any,
  ) {
    return await this.userService.addVectorToCollection(collectionName, points);
  }

  @Get('collection/search/vector')
  async searchVector(
    @Body('collectionName') collectionName: string,
    @Body('queryVector') queryVector: any,
  ) {
    return await this.userService.searchVectorsInCollection(
      collectionName,
      queryVector,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUser: CreateUserDto) {
    return await this.userService.create(createUser);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
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
