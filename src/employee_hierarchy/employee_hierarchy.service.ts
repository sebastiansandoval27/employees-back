import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmployeeHierarchyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const resp = await this.prisma.employeeHierarchy.findMany({
      include: {
        employee: true,
        manager: true,
      },
    });

    const hierarchy = resp.map((employee) => {
      return {
        id: employee.id,
        name: employee.employee.name,
        version: employee.employee.version,
        manager: employee.manager?.name || null,
        managerVersion: employee.manager?.version || null,
      };
    });

    return hierarchy;
  }
}
