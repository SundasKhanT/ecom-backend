import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { SignupResponse } from './auth';
import { LoginDTO } from './dtos/login.dto';
import { SignupDTO } from './dtos/sigup.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signup(payload: SignupDTO): Promise<SignupResponse> {
    const existingUser = await this.prisma.auth.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exist.', {
        cause: new Error(),
        description: 'User already exists with this email address.',
      });
    }

    const hashedPassword = await this.encryptPassword(payload.password, 10);
    payload.password = hashedPassword;
    const result = await this.prisma.auth.create({
      data: payload,
      select: {
        id: true,
        email: true,
      },
    });
    return {
      id: result.id.toString(),
      email: result.email,
    };
  }

  async encryptPassword(plainText, saltRound) {
    return await bcrypt.hash(plainText, saltRound);
  }

  async decryptedPassword(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
  }

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.prisma.auth.findFirst({
      where: {
        email: loginDTO.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email', {
        cause: new Error(),
      });
    }

    const isMatched = await this.decryptedPassword(
      loginDTO.password,
      user.password,
    );

    if (!isMatched) {
      throw new UnauthorizedException('Invalid password', {
        cause: new Error(),
      });
    }

    const accessToken = await this.jwtService.signAsync(
      {
        email: user.email,
        id: user.id.toString(),
      },
      {
        expiresIn: '1d',
      },
    );

    return {
      accessToken,
    };
  }
}
