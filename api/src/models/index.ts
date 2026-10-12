import Employee from './Employee.js';
import Event from './Event.js';
import Registrant from './Registrant.js';

const models = {
  Employee,
  Event,
  Registrant,
};

Employee.hasMany(Event, { foreignKey: 'handler_uuid', as: 'events' });
Event.belongsTo(Employee, { foreignKey: 'handler_uuid', as: 'handler' });
Event.hasMany(Registrant, { foreignKey: 'event_uuid', as: 'registrants' });
Registrant.belongsTo(Event, { foreignKey: 'event_uuid', as: 'event' });

export default models;
