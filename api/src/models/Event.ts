import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import sequelize from '../config/db.js';
import Employee from './Employee.js';

class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  declare uuid: CreationOptional<string>;
  declare name: string;
  declare dateTime: Date;
  declare address: string;
  declare deadline: Date;
  declare capacity: number;
  declare registrationCount: CreationOptional<number>;
  declare handlerUuid: string;
  declare handler?: Employee;
  
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Event.init(
  {
    uuid: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    registrationCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    handlerUuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'employees',
        key: 'uuid',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'events',
  }
);

export default Event;
