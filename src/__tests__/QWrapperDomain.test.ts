import {QWrapperDomain, QWrapperSettings} from '..';
import {ExchangeType} from "../models/QWrapperSettings";

const settings: QWrapperSettings = {
  exchange: 'amq.fanout',
  connection: {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'admin',
    password: 'admin',
    vhost: 'vhost',
  },
  queue: 'myqueue.events',
  exchangeType: ExchangeType.fanout,
  reconnect: false,
  dleExchange: 'amq.fanout',
  dleQueue: 'myqueue.dle_events',
};

test('Queue manager constructor string url', done => {
  const qw = new QWrapperDomain({
    ...settings,
    connection: 'amqp://admin:admin@localhost:5672/vhost',
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
