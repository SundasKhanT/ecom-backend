import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { SignupResponse } from './auth';
import { SignupDto } from './sigup.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(payload: SignupDto): Promise<SignupResponse> {
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
}
