
import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private UsersService: UsersService) {}

  @Post('register')
  async Register(@Body() RegisterDTO: RegisterDTO) {
    return this.UsersService.Create(RegisterDTO);
  }

  @Post('login')
  async Login(@Body() LoginDTO: LoginDTO) {
    const User = await this.UsersService.FindByUserIdentifier(LoginDTO.UserIdentifier);
    
    if (User && ((User.Password) === (LoginDTO.Password))) {
      return User;
    }
    
    return {
      error: 'Invalid credentials'
    };
  }
}
