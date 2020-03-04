import {QWrapperDomain, QWrapperSettings} from '..';

test('Queue manager constructor string url', (done) => {
  const qw = new QWrapperDomain({
    exchange: 'dsd_exchange',
    connection: 'amqp://localhost',
    queue:'dsd_queue',
    dleQueue: 'dsd_dead_letter',
    exchangeType: 'direct'
  });
  done()
});

test('Queue manager constructor object connectionUrl', (done) => {
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
    dleQueue: 'dsd_dead_letter',
    exchangeType: 'fanout'
  };

  const qManager = new QWrapperDomain(settings);
  done();
});
