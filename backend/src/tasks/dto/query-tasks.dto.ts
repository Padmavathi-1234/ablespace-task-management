import { IsIn, IsOptional, IsString } from 'class-validator';

export class QueryTasksDto {
  @IsOptional()
  @IsIn(['todo', 'doing', 'completed', 'on-hold', 'review', 'backlog'])
  status?: string;

  @IsOptional()
  @IsIn(['urgent', 'high', 'medium', 'low', 'no-priority'])
  priority?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  parentId?: string; // pass "null" to get only top-level tasks
}
