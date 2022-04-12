import { QWrapperDomain, QWrapperSettings } from '..';

const settings: QWrapperSettings = {
  exchange: 'test_dsd_exchange',
  connection: {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/',
  },
  queue: 'test_dsd_queue',
  exchangeType: 'fanout',
  reconnect: false,
  dleExchange: 'test_dsd_dead_exchange',
  dleQueue: 'test_dsd_dead_letter',
};

test('Queue manager constructor string url', done => {
  const qw = new QWrapperDomain({
    ...settings,
    connection: 'amqp://localhost',
  });
  done();
});

test('Queue manager constructor object connectionUrl', done => {
  const qManager = new QWrapperDomain(settings);
  done();
});

test('Close channel returns a promise', async () => {
  const qManager = new QWrapperDomain(settings);
  await qManager.initialize();
  expect(qManager['_channel']).toBeDefined();
  await qManager.close();
  expect(qManager['_channel']).toBeUndefined();
  await qManager.closeConnection();
});

test('Close connection returns a promise', async () => {
  const qManager = new QWrapperDomain(settings);
  await qManager.initialize();
  expect(qManager['_channel']).toBeDefined();
  await qManager.closeConnection();
  expect(qManager['_channel']).toBeUndefined();
  expect(qManager['_connection']).toBeUndefined();
});
