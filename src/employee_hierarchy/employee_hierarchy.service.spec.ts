import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeHierarchyService } from './employee_hierarchy.service';

describe('EmployeeHierarchyService', () => {
  let service: EmployeeHierarchyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeHierarchyService],
    }).compile();

    service = module.get<EmployeeHierarchyService>(EmployeeHierarchyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
