import {QueueManagerDomain, QueueSettings} from '../index';

test('Queue manager constructor', () => {
  const settings: QueueSettings = {
    exchange: 'dsd_exchange',
    connectionURL: 'amqp://localhost',
    queue:'dsd_queue',
    dleQueue: 'dsd_dead_letter'
  };

  const qManager = new QueueManagerDomain(settings);

  expect(qManager.settings).toBe(settings);
});
