import {QWrapperDomain, QWrapperSettings} from './index';

const settings: QWrapperSettings = {
  queue: 'demo.queue',
  dleQueue: 'demo.dle_queue',
  connection: 'amqp://localhost',
  exchange: 'demo.exchange',
  exchangeType: 'direct'
};

const qm = new QWrapperDomain(settings);

qm.initialize().then(() => {
  // Send messages
  qm.sendToQueue({message: 'Hallo queue'});
  qm.sendToQueue({message: 'Hallo queue again'});

  // Consume messages
  qm.consume((message) => {
    console.log(" [x] Received %s", message.content.toString());
    return {
      processed: true,
      requeue: false
    }
  });

  // Close connection
  setTimeout(() => {
    qm.close();
    process.exit(0);
  }, 1000);
}).catch(error => {
  console.error(error);
  process.exit(1)
});

