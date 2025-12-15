
import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dto/register.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly AuthenticationService: AuthenticationService, private UsersService: UsersService) {}

  @Post('register')
  async Register(@Body() RegisterDTO: RegisterDTO) {
    return this.UsersService.Create(RegisterDTO);
  }
}
