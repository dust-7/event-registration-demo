import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import sequelize from '../config/db.js';

class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  declare uuid: CreationOptional<string>;
  declare name: string;
  declare date_time: Date;
  declare address: string;
  declare deadline: Date;
  declare capacity: number;
  declare handler_uuid: string;
  
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
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
    date_time: {
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
    handler_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'employees',
        key: 'uuid',
      },
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'events',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Event;
