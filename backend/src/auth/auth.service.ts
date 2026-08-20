import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GuestLoginDto } from './dto/guest-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async guestLogin(dto: GuestLoginDto): Promise<AuthResponseDto> {
    const guestName = dto.name?.trim() || 'Guest User';

    // Reuse a single shared guest user for simplicity (seeded as guest@ablespace.io)
    // Or create a new guest each time — for assessment, reusing is cleaner
    let user = await this.prisma.user.findFirst({
      where: { isGuest: true, email: 'guest@ablespace.io' },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: `guest-${Date.now()}@ablespace.io`,
          fullName: guestName,
          username: `guest_${Date.now()}`,
          title: 'Member',
          isGuest: true,
          theme: 'light',
          colorMode: 'blue',
        },
      });
    }

    const accessToken = await this.generateToken(user.id, user.email);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        title: user.title,
        avatarUrl: user.avatarUrl,
        isGuest: user.isGuest,
        theme: user.theme,
        colorMode: user.colorMode,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true,
        title: true,
        avatarUrl: true,
        isGuest: true,
        theme: true,
        colorMode: true,
        createdAt: true,
      },
    });

    return user;
  }

  // Bonus: login as Dexter for demo (useful for testing with seeded data)
  async demoLogin(): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: 'dexter@gmail.com' },
    });

    if (!user) {
      // fallback to guest if seed wasn't run
      return this.guestLogin({ name: 'Guest User' });
    }

    const accessToken = await this.generateToken(user.id, user.email);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        title: user.title,
        avatarUrl: user.avatarUrl,
        isGuest: user.isGuest,
        theme: user.theme,
        colorMode: user.colorMode,
      },
    };
  }

  private async generateToken(userId: string, email: string | null): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload);
  }
}
