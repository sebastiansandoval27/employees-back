import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeHierarchyDto } from './create-employee_hierarchy.dto';

export class UpdateEmployeeHierarchyDto extends PartialType(CreateEmployeeHierarchyDto) {}
