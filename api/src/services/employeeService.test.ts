import { afterEach, beforeEach, describe, expect, test, jest } from '@jest/globals';
import { Employee } from '../models/index.js';
import employeeService from './employeeService.js';

const mockEmployee = { uuid: 'abc-123', name: 'Alice' } as any;

describe('employeeService', () => {
  let findAllSpy: jest.Spied<typeof Employee.findAll>;
  let findByPkSpy: jest.Spied<typeof Employee.findByPk>;

  beforeEach(() => {
    findAllSpy = jest.spyOn(Employee, 'findAll');
    findByPkSpy = jest.spyOn(Employee, 'findByPk');
    findAllSpy.mockResolvedValue([mockEmployee]);
    findByPkSpy.mockResolvedValue(mockEmployee);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('listEmployees', () => {
    test('returns employees ordered by name ascending', async () => {
      const result = await employeeService.listEmployees();

      expect(findAllSpy).toHaveBeenCalledWith({
        attributes: ['uuid', 'name'],
        order: [['name', 'ASC']],
      });
      expect(result).toEqual([mockEmployee]);
    });
  });

  describe('getEmployeeByUuid', () => {
    test('returns employee by primary key', async () => {
      const result = await employeeService.getEmployeeByUuid('abc-123');

      expect(findByPkSpy).toHaveBeenCalledWith('abc-123');
      expect(result).toEqual(mockEmployee);
    });

    test('returns null when employee is not found', async () => {
      findByPkSpy.mockResolvedValue(null);

      const result = await employeeService.getEmployeeByUuid('nonexistent');

      expect(findByPkSpy).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });
  });
});
