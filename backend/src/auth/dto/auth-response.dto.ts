export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string | null;
    fullName: string;
    username: string | null;
    title: string | null;
    avatarUrl: string | null;
    isGuest: boolean;
    theme: string;
    colorMode: string;
  };
}
