import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves all employees.
   * @returns A list of all employees.
   */
  async findAll() {
    return await this.prisma.employee.findMany();
  }

  /**
   * Retrieves all employees with their hierarchy information.
   * @returns A list of all employees with their hierarchy information.
   */
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

  /**
   * Updates the role and version of an employee and their previous manager.
   * @param prisma The Prisma service instance.
   * @param newManagerId The ID of the new manager.
   * @param currentManager The ID of the current manager.
   */
  async updateEmployee(
    prisma: PrismaService,
    newManagerId: number,
    currentManager: number,
  ) {
    // Update the employee record
    await prisma.employee.update({
      where: { id: Number(newManagerId) },
      data: { role: 'MANAGER', version: { increment: 1 } },
    });

    // Update the previous manager record
    await prisma.employee.update({
      where: { id: Number(currentManager) },
      data: { role: 'EMPLOYEE', version: { increment: 1 } },
    });
  }

  /**
   * Updates the employeeHierarchy record for the new manager.
   * @param prisma The Prisma service instance.
   * @param newManagerId The ID of the new manager.
   * @param currentManager The ID of the current manager.
   */
  async updateManyEmployees(
    prisma: PrismaService,
    newManagerId: number,
    currentManager: number,
  ) {
    // Update the employeeHierarchy record for the new manager
    await prisma.employeeHierarchy.updateMany({
      where: {
        employee_id: Number(currentManager),
      },
      data: { manager_id: Number(newManagerId) },
    });
  }

  /**
   * Retrieves the employee record of the new manager.
   * @param prisma The Prisma service instance.
   * @param newManagerId The ID of the new manager.
   * @returns The employee record of the new manager.
   */
  async getNewManagerEmployee(prisma: PrismaService, newManagerId: number) {
    return await prisma.employee.findUnique({
      where: { id: Number(newManagerId) },
      include: { employeeHierarchy: {}, managerHierarchy: {} },
    });
  }

  /**
   * Retrieves the employee record of the current manager.
   * @param prisma The Prisma service instance.
   * @param managerId The ID of the current manager.
   * @returns The employee record of the current manager.
   */
  async getCurrentManagerRecord(prisma: PrismaService, managerId: number) {
    return await prisma.employee.findUnique({
      where: {
        id: Number(managerId),
      },
    });
  }

  /**
   * Updates the manager of an employee and handles the necessary updates in the employee hierarchy.
   * @param newManagerId The ID of the new manager.
   * @returns A success message if the update is successful, otherwise an error message.
   */
  async updateManager(newManagerId: number) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Get the employee record
        const newManager = await this.getNewManagerEmployee(
          this.prisma,
          newManagerId,
        );

        // Get the current manager record
        const currentManager = await this.getCurrentManagerRecord(
          this.prisma,
          newManager?.employeeHierarchy[0]?.manager_id,
        );

        // Get the current manager's subordinates
        const currentSubordinates = await prisma.employeeHierarchy.findMany({
          where: {
            manager_id: Number(newManager?.employeeHierarchy[0]?.manager_id),
          },
        });

        // Update the employeeHierarchy records for the current manager's subordinates
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

        // Update the employeeHierarchy record for the new manager
        await this.updateManyEmployees(
          this.prisma,
          newManagerId,
          currentManager?.id,
        );

        // Update the employee record
        await this.updateEmployee(
          this.prisma,
          newManagerId,
          currentManager?.id,
        );

        return { success: true };
      });
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
}
