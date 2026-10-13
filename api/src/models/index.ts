import Employee from './Employee.js';
import Event from './Event.js';
import Registrant from './Registrant.js';

Employee.hasMany(Event, { foreignKey: 'handlerUuid', as: 'events' });
Event.belongsTo(Employee, { foreignKey: 'handlerUuid', as: 'handler' });
Event.hasMany(Registrant, { foreignKey: 'eventUuid', as: 'registrants' });
Registrant.belongsTo(Event, { foreignKey: 'eventUuid', as: 'event' });

export { Employee, Event, Registrant };
