import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { User } from '../users/users.entity';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly UsersService: UsersService) {}

  @Post('register')
  async Register(@Body() Data: RegisterDTO): Promise<User> {
    return this.UsersService.Create(Data);
  }

  @Post('login')
  async Login(@Body() Data: LoginDTO): Promise<User | { error: string }> {
    const FoundUser: User | null = await this.UsersService.FindByUserIdentifier(Data.UserIdentifier);
    
    if (FoundUser && ((FoundUser.Password) === (Data.Password))) {
      return FoundUser;
    }
    
    return {
      error: 'Invalid credentials'
    };
  }
}
