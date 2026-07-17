import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';



const ErrorCodePrefix: string = '01_';

const EmptyFieldError: string = `${ErrorCodePrefix}000`;
const InvalidEmailError: string = `${ErrorCodePrefix}001`;
const InvalidPasswordError: string = `${ErrorCodePrefix}002`;



export class RegisterDTO {
  @IsEmail({}, { message: InvalidEmailError })
  @IsNotEmpty({ message: EmptyFieldError })
  Email!: string;

  @IsString()
  @IsNotEmpty({ message: EmptyFieldError })
  PhoneNumber!: string;
  
  @IsString()
  @IsNotEmpty({ message: EmptyFieldError })
  Username!: string;

  @IsString()
  @IsNotEmpty({ message: EmptyFieldError })
  @MinLength(6, { message: InvalidPasswordError })
  Password!: string;
}