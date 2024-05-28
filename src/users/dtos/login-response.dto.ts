export class LoginResponseDto {
  message: string;
  data: {
    token: string;
  };
  statusCode: number;
}
