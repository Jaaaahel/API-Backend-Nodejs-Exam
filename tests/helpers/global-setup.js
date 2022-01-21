require('../../bootstrap');
const jest = require('jest');
const { Umzug, SequelizeStorage } = require('umzug');
const { getDBInstance } = require('../../database');

const sequelize = getDBInstance();

const umzug = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
    resolve: ({ name, path, context }) => {
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(context),
        down: async () => migration.down(context),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

module.exports = async () => {
  // jest.useFakeTimers();
  await sequelize.authenticate();
  await umzug.up();
};
