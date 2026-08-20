import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  color?: string; // hex color string e.g. #3B82F6
}
