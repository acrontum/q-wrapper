# q-wrapper

A TypeScript npm package that manages queue connections and operations. 

Please read RabbitMQ site for more documentation (https://www.rabbitmq.com/).

## Initialization

Define the queue, dead letter queue, and exchange for the service.
This defined queues will be created automatically in RabbitMQ.

Ex:

```
import {QWrapperDomain, ConsumerResponse, Message, QWrapperSettings} from 'q-wrapper';

const settings: QWrapperSettings = {
  queue: 'demo.queue',
  dleQueue: 'demo.dle_queue', /* dleQueue stands for dead letter exchange queue */
  connectionURL: 'amqp://localhost', /* Can also be a connection object see: src/models/QWrapperSettings.ts */
  exchange: 'demo.exchange',
  exchangeType: 'direct'
};
```
Pass the settings to the constructor or call the settings setter method.

```
const qm = new QWrapperDomain(settings);
await qm.initialize();
```

## Sending messages

Any object message is allowed.

```
qm.sendToQueue({message: 'Hallo queue'});
```

## Consuming messages

When consuming a message, a response need to be sent to let the service now if the message was processed successfully or not.

If processed is marked as false, and requeue to true, then the message will be requeue.
If processed is marked as false, and requeue to false, then the message will be sent to the dead letter queue.

```
qm.consume((message) => {
// Start doing something with the message...
...
// Return a response 
return {
  processed: true,
  requeue: false
}
});
```
