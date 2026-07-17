import { IsNotEmpty, IsString, MinLength } from 'class-validator';



const ErrorCodePrefix: string = '01_';

const EmptyFieldError: string = `${ErrorCodePrefix}000`;
const InvalidPasswordError: string = `${ErrorCodePrefix}002`;



export class LoginDTO {
  @IsString()
  @IsNotEmpty({ message: EmptyFieldError })
  UserIdentifier!: string;

  @IsString()
  @IsNotEmpty({ message: EmptyFieldError })
  @MinLength(6, { message: InvalidPasswordError })
  Password!: string;
}