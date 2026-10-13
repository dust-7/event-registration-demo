import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import sequelize from '../config/db.js';
import Event from './Event.js';

class Registrant extends Model<InferAttributes<Registrant>, InferCreationAttributes<Registrant>> {
  declare eventUuid: string;
  declare emailAddress: string;
  declare registrationNo: CreationOptional<number>;
  
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Registrant.init(
  {
    eventUuid: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'events',
        key: 'uuid',
      },
    },
    emailAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    registrationNo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'registrants',
  }
);

Registrant.addHook('beforeValidate', async (registrant: Registrant) => {
  // autogenerate registration_no
  const maxNo = await Registrant.max<number, Registrant>('registrationNo', {
    where: { eventUuid: registrant.eventUuid },
  });
  registrant.registrationNo = (maxNo ?? 0) + 1;
});

Registrant.addHook('afterCreate', async (registrant: Registrant) => {
  await Event.increment('registrationCount', {
    where: { uuid: registrant.eventUuid },
  });
});

export default Registrant;
