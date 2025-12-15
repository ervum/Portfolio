import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { RegisterDTO } from '../authentication/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    
    private UsersRepository: Repository<User>
  ) {}

  async Create(RegisterDTO: RegisterDTO): Promise<User> {
    const NewUser = this.UsersRepository.create(RegisterDTO); 

    return this.UsersRepository.save(NewUser);
  }
}