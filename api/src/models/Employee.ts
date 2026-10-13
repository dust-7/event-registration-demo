import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import sequelize from '../config/db.js';

class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
  declare uuid: CreationOptional<string>;
  declare name: string;
  
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'employees',
  }
);

export default Employee;
