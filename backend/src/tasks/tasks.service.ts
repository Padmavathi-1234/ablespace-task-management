import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    const { labelIds, dueDate, startDate, userId: assigneeId, ...rest } = dto;

    return this.prisma.task.create({
      data: {
        ...rest,
        creatorId: userId,
        userId: assigneeId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        labels: labelIds?.length
          ? { connect: labelIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true, email: true },
        },
        labels: true,
        _count: { select: { subtasks: true, comments: true } },
      },
    });
  }

  async findAll(query: QueryTasksDto) {
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.projectId) where.projectId = query.projectId;

    // Top-level tasks only by default
    if (query.parentId === 'null' || query.parentId === undefined) {
      where.parentId = null;
    } else if (query.parentId) {
      where.parentId = query.parentId;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.task.findMany({
      where,
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true, email: true },
        },
        labels: true,
        _count: { select: { subtasks: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            email: true,
            username: true,
          },
        },
        creator: { select: { id: true, fullName: true, avatarUrl: true } },
        labels: true,
        project: true,
        subtasks: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
            labels: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        comments: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const { labelIds, dueDate, startDate, userId: assigneeId, ...rest } = dto;

    const data: any = { ...rest };

    if (assigneeId !== undefined) {
      data.userId = assigneeId;
    }

    if (dueDate !== undefined) {
      data.dueDate = dueDate ? new Date(dueDate) : null;
    }

    if (startDate !== undefined) {
      data.startDate = startDate ? new Date(startDate) : null;
    }

    if (labelIds !== undefined) {
      data.labels = { set: labelIds.map((id) => ({ id })) };
    }

    return this.prisma.task.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true, email: true },
        },
        labels: true,
        _count: { select: { subtasks: true, comments: true } },
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
