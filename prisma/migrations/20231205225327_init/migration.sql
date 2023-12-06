-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeHierarchy" (
    "id" SERIAL NOT NULL,
    "version" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "manager_id" INTEGER,

    CONSTRAINT "EmployeeHierarchy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmployeeHierarchy" ADD CONSTRAINT "EmployeeHierarchy_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeHierarchy" ADD CONSTRAINT "EmployeeHierarchy_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
