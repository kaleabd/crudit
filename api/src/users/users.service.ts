import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.usersRepository.create(dto);
    return await this.usersRepository.save(user);
  }

  findMany() {
    return this.usersRepository.find();
  }

  async update(id: number, dto: CreateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    Object.assign(user, dto);

    return await this.usersRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    return await this.usersRepository.remove(user);
  }
}
