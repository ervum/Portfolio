import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { User } from '../users/users.entity';

import { Nullable } from '@ervum/types';



@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly UsersService: UsersService) {}

  @Post('register')
  async Register(@Body() Data: RegisterDTO): Promise<User> {
    return this.UsersService.Create(Data);
  }

  @Post('login')
  async Login(@Body() Data: LoginDTO): Promise<User> {
    const FoundUser: Nullable<User> = await this.UsersService.FindByUserIdentifier(Data.UserIdentifier);
    
    if (FoundUser && ((FoundUser.Password) === (Data.Password))) {
      return FoundUser;
    }
    
    throw new UnauthorizedException('Invalid credentials');
  }
}

