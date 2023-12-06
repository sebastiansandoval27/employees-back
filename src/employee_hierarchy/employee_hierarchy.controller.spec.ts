import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeHierarchyController } from './employee_hierarchy.controller';
import { EmployeeHierarchyService } from './employee_hierarchy.service';

describe('EmployeeHierarchyController', () => {
  let controller: EmployeeHierarchyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeHierarchyController],
      providers: [EmployeeHierarchyService],
    }).compile();

    controller = module.get<EmployeeHierarchyController>(EmployeeHierarchyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
