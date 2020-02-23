import {QWrapperDomain} from "./domains/QWrapperDomain";
import {QWrapperSettings} from "./models";

const settings: QWrapperSettings = {
  queue: 'dsd.queue',
  dleQueue: 'dsd.dle_queue',
  connectionURL: 'amqp://localhost',
  exchange: 'dsd.exchange',
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

