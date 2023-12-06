import { Module } from '@nestjs/common';
import { EmployeeHierarchyService } from './employee_hierarchy.service';
import { EmployeeHierarchyController } from './employee_hierarchy.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EmployeeHierarchyController],
  providers: [EmployeeHierarchyService, PrismaService],
})
export class EmployeeHierarchyModule {}
