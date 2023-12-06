import { Controller, Get } from '@nestjs/common';
import { EmployeeHierarchyService } from './employee_hierarchy.service';

@Controller('/api/employee-hierarchy')
export class EmployeeHierarchyController {
  constructor(
    private readonly employeeHierarchyService: EmployeeHierarchyService,
  ) {}

  @Get()
  findAll() {
    return this.employeeHierarchyService.findAll();
  }
}
