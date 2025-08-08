import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  email: string;
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
