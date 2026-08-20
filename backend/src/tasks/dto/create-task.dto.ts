import {
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['todo', 'doing', 'completed', 'on-hold', 'review', 'backlog'])
  status?: string;

  @IsOptional()
  @IsIn(['urgent', 'high', 'medium', 'low', 'no-priority'])
  priority?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  userId?: string; // assignee

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labelIds?: string[];
}
