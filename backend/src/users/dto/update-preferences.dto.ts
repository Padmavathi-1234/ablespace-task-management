import { IsIn, IsOptional } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: string;

  @IsOptional()
  @IsIn(['amber', 'blue', 'pink', 'rose', 'emerald', 'black'])
  colorMode?: string;
}
