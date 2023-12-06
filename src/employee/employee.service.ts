import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.employee.findMany();
  }

  async findWithHierarchy() {
    try {
      return await this.prisma.employee.findMany({
        include: {
          employeeHierarchy: {},
          managerHierarchy: {
            include: {
              employee: {},
              manager: {},
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateManager(newManagerId: number) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const newManager = await prisma.employee.findUnique({
          where: { id: Number(newManagerId) },
          include: { employeeHierarchy: {}, managerHierarchy: {} },
        });

        const currentManager = await prisma.employee.findUnique({
          where: {
            id: Number(newManager?.employeeHierarchy[0]?.manager_id),
          },
        });

        const currentSubordinates = await prisma.employeeHierarchy.findMany({
          where: {
            manager_id: Number(newManager?.employeeHierarchy[0]?.manager_id),
          },
        });

        await Promise.all(
          currentSubordinates.map(async (sub) => {
            if (sub.employee_id !== Number(newManagerId)) {
              // Update the existing employeeHierarchy record
              return prisma.employeeHierarchy.update({
                where: { id: sub.id },
                data: {
                  manager_id: Number(newManagerId),
                  version: { increment: 1 },
                },
              });
            } else {
              // Remove the manager_id for the specified employee
              return prisma.employeeHierarchy.update({
                where: { id: sub.id },
                data: { manager_id: null, version: { increment: 1 } },
              });
            }
          }),
        );
        //  Update the employeeHierarchy record for the new manager
        await prisma.employeeHierarchy.updateMany({
          where: {
            employee_id: Number(currentManager?.id),
          },
          data: { manager_id: Number(newManagerId) },
        });

        // Update the employee record
        await prisma.employee.update({
          where: { id: Number(newManagerId) },
          data: { role: 'MANAGER', version: { increment: 1 } },
        });

        // Update the previous manager record
        await prisma.employee.update({
          where: { id: Number(currentManager?.id) },
          data: { role: 'EMPLOYEE', version: { increment: 1 } },
        });

        return { success: true };
      });
    } catch (error) {
      console.log(error);
    }
  }
}
