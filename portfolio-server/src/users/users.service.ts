import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, FindOptionsWhere } from 'typeorm';

import { User } from './users.entity';
import { RegisterDTO } from '../authentication/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)

    private readonly UsersRepository: Repository<User>
  ) {}

  async Create(RegisterDTO: RegisterDTO): Promise<User> {
    const NewUser = this.UsersRepository.create(RegisterDTO); 

    return this.UsersRepository.save(NewUser);
  }

  /**
   * Finds a user by their identifier (Username, Email, PhoneNumber, or numeric ID).
   */
  async FindByUserIdentifier(Identifier: (string | number)): Promise<User | null> {
    const StringIdentifier = String(Identifier);
    const Conditions: FindOptionsWhere<User>[] = [
      { Username: StringIdentifier },

      { Email: StringIdentifier },
      { PhoneNumber: StringIdentifier }
    ];
    // Attempt to parse the identifier as a number in case it matches an ID
    let NumericIdentifier: number = 0;
    
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