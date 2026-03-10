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

  async FindByUserIdentifier(Identifier: (string | number)): Promise<User | null> {
    const Conditions: any[] = [
      { Username: Identifier },

      { Email: Identifier },
      { PhoneNumber: Identifier }
    ];
    var NumericIdentifier: number = 0;
    
    if (typeof Identifier === 'string') {
      NumericIdentifier = parseInt(Identifier);
    } else if (typeof Identifier === 'number') {
      NumericIdentifier = Identifier;
    }

    if (!isNaN(NumericIdentifier)) {
      Conditions.push({ ID: NumericIdentifier });
    }

    return this.UsersRepository.findOne({
      where: Conditions
    });
  }
}