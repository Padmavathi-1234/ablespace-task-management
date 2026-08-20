import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.label.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateLabelDto) {
    const existing = await this.prisma.label.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.label.create({
      data: {
        name: dto.name,
        color: dto.color || '#3B82F6',
      },
    });
  }
}
