export class RegisterResponseDto {
  message: string;
  data: {
    token: string;
  };
  statusCode: number;
}
