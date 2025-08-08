import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { SignupDTO } from './dtos/sigup.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async create(@Body() signupDTO: SignupDTO) {
    return await this.authService.signup(signupDTO);
  }

  @Post('/login')
  async login(@Body() loginDTO: LoginDTO) {
    {
      return await this.authService.login(loginDTO);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
