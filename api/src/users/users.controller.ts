import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //create
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  //list
  @Get()
  findMany() {
    return this.usersService.findMany();
  }

  //update
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CreateUserDto) {
    return this.usersService.update(id, dto);
  }

  //delete
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
