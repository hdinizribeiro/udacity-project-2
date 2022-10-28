import DbMigrate from 'db-migrate';

const dbMigrate = DbMigrate.getInstance(true, {
  env: 'test'
});

dbMigrate.silence(true);

beforeEach(async () => {
  await dbMigrate.reset();
  await dbMigrate.up();
});
