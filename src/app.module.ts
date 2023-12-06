import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { EmployeeHierarchyModule } from './employee_hierarchy/employee_hierarchy.module';

@Module({
  imports: [EmployeeModule, EmployeeHierarchyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
