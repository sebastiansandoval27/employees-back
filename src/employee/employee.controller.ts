import { Controller, Get, Param, Patch } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('/api/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('hierarchy')
  findWithHierarchy() {
    return this.employeeService.findWithHierarchy();
  }

  @Patch(':managerId')
  async updateEmployeeManager(@Param('managerId') managerId: number) {
    return await this.employeeService.updateManager(managerId);
  }
}
