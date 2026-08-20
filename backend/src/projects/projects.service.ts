import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    let workspace = await this.prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await this.prisma.workspace.create({
        data: { name: 'Default Workspace' },
      });
    }

    const leadId = dto.leadId || userId;

    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        priority: dto.priority || 'medium',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        workspaceId: workspace.id,
        leadId,
      },
      include: {
        lead: {
          select: { id: true, fullName: true, avatarUrl: true, email: true },
        },
        workspace: true,
        _count: { select: { tasks: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        lead: {
          select: { id: true, fullName: true, avatarUrl: true, email: true },
        },
        workspace: true,
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        lead: {
          select: { id: true, fullName: true, avatarUrl: true, email: true },
        },
        workspace: true,
        tasks: {
          include: {
            user: {
              select: { id: true, fullName: true, avatarUrl: true, email: true },
            },
            labels: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const { dueDate, ...rest } = dto;
    const data: any = { ...rest };

    if (dueDate !== undefined) {
      data.dueDate = dueDate ? new Date(dueDate) : null;
    }

    return this.prisma.project.update({
      where: { id },
      data,
      include: {
        lead: {
          select: { id: true, fullName: true, avatarUrl: true, email: true },
        },
        workspace: true,
        _count: { select: { tasks: true } },
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
