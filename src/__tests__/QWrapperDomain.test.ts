import {QWrapperDomain, QWrapperSettings} from '..';

test('Queue manager constructor string url', () => {
  const settings: QWrapperSettings = {
    exchange: 'dsd_exchange',
    connection: 'amqp://localhost',
    queue:'dsd_queue',
    dleQueue: 'dsd_dead_letter'
  };

  const qManager = new QWrapperDomain(settings);

  expect(qManager.settings).toBe(settings);
});

test('Queue manager constructor object connectionUrl', () => {
  const settings: QWrapperSettings = {
    exchange: 'dsd_exchange',
    connection: {
      protocol: 'amqp',
      hostname: 'localhost',
      port: 5672,
      username: 'bob',
      password: 'bobspassword',
      locale: 'en_US',
      frameMax: 0,
      heartbeat: 0,
      vhost: '/',
    },
    queue:'dsd_queue',
    dleQueue: 'dsd_dead_letter'
  };

  const qManager = new QWrapperDomain(settings);

  expect(qManager.settings).toBe(settings);
});
