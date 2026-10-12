import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import sequelize from '../config/db.js';

class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
  declare uuid: CreationOptional<string>;
  declare name: string;
  
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Employee.init(
  {
    uuid: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'employees',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Employee;
