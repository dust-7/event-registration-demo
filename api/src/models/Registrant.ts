import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import sequelize from '../config/db.js';

class Registrant extends Model<InferAttributes<Registrant>, InferCreationAttributes<Registrant>> {
  declare event_uuid: string;
  declare email_address: string;
  declare registration_no: CreationOptional<number>;
  
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Registrant.init(
  {
    event_uuid: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'events',
        key: 'uuid',
      },
    },
    email_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    registration_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'registrants',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Registrant.addHook('beforeValidate', async (registrant: Registrant) => {
  // autogenerate registration_no
  const maxNo = await Registrant.max<number, Registrant>('registration_no', {
    where: { event_uuid: registrant.event_uuid },
  });
  registrant.registration_no = (maxNo ?? 0) + 1;
});

export default Registrant;
