import { ConsumerResponse, QWrapperDomain } from '../lib/index';
import { Message } from 'amqplib';
import EventBus from 'somelib/eventbus'; // <- made up, please write your own app eventbus

/**
 * Imagine this demo class is a microservice.
 * It sends emails.
 *
 * There is 1 main exchange between all services named "main".
 * Publishing to the exchange is a fanout to all queues within the exchange.
 * Each service checks the routing key before acting.
 * Additionally, the service it sits within sends events internally to an event bus.
 * This class listens to events on the bus and selectively publishes to the exchange.
 */
class Demo {
  private qw: QWrapperDomain | undefined;

  async bind () {
    const qw = new QWrapperDomain({
      connection: 'amqp://rabbitmq.mydomain.org',
      exchange: 'main',
      exchangeType: 'fanout',
      queue: 'thisDemoService',
      dleQueue: 'dead-letters'
    });
    await qw.initialize();
    qw.consume(this.consume);
    this.publishEvents();
  }

  async consume (message: Message): Promise<ConsumerResponse> {
    if (message.fields.routingKey === 'auth.user.new') {
      // Do something with the data
    }
    return {
      processed: true,
      requeue: false
    };
  }

  async publishEvents () {
    EventBus.on('email.user.new.sent', (payload: any) => {
      this.qw?.sendToExchange(payload, 'email.user.new.sent');
    });
  }
}
