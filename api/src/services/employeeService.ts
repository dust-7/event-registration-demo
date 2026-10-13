import { Employee } from '../models/index.js';

const employeeService = {
  async listEmployees() {
    return Employee.findAll({
      attributes: ['uuid', 'name'],
      order: [['name', 'ASC']],
    });
  },

  async getEmployeeByUuid(uuid: string) {
    return Employee.findByPk(uuid);
  },
};

export default employeeService;
