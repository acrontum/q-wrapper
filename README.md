# Queue manager

Typescript npm package that manages queue connections and operations. 

Please read RabbitMQ site for more documentation (https://www.rabbitmq.com/).

## Initialization

Define the queue, dead letter queue, and exchange for the service.
This defined queues will be created automatically in RabbitMQ.

Ex:

```
const settings: RabbitMQSettings = {
  queue: 'dsd.queue',
  dleQueue: 'dsd.dle_queue',
  connectionURL: 'amqp://localhost',
  exchange: 'dsd.exchange',
  exchangeType: 'direct'
};
```
Pass the settings to the constructor or call the settings setter method.

```
const qm = new QueueManagerDomain(settings);
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
