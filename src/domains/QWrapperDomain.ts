import * as amqp from 'amqplib/callback_api';
import { ConsumerResponse, QWrapperSettings } from '../models';
import { Channel, Message as amqMessage } from 'amqplib/callback_api';

export class QWrapperDomain {

  private _settings: QWrapperSettings;
  private _channel: amqp.Channel | undefined;
  private _connection: amqp.Connection | undefined;

  constructor (settings: QWrapperSettings) {
    this._settings = settings;
  }

  public initialize (): Promise<void> {
    return new Promise((resolve) => {
      amqp.connect(this._settings.connection, (error0, connection) => {
        if (error0) {
          console.error('Error connecting to queue... ', error0);
          throw error0;
        }

        this._connection = connection;

        this._connection.createChannel((error1, channel) => {
          if (error1) {
            console.error('Error creating channel... ', error1);
            throw error1;
          }

          console.info('Channel created successfully');
          this._channel = channel;
          const durable = {
            durable: true
          };
          this._channel.assertExchange(this._settings.exchange, this._settings.exchangeType, durable);
          this._channel.assertQueue(this._settings.dleQueue, durable);

          this._channel.bindQueue(this._settings.dleQueue, this._settings.exchange, this._settings.dleQueue);

          this._channel.assertQueue(this._settings.queue, {
            durable: true,
            deadLetterExchange: this._settings.exchange,
            deadLetterRoutingKey: this._settings.dleQueue
          });

          this._channel.bindQueue(this._settings.queue, this._settings.exchange, this._settings.queue);

          this._channel.prefetch(1);

          return resolve();
        });
      });
    });
  }

  public sendToQueue (message: object, queueName?: string): boolean {
    if (this._channel) {
      const messageToSend = Buffer.from(JSON.stringify(message));
      const queue = queueName ? queueName : this._settings.queue;
      const response = this._channel.sendToQueue(queue, messageToSend, {
        persistent: true,
        contentType: 'application/json'
      });
      return response;
    } else {
      throw Error('Channel not set up.');
    }
  }

  public sendToExchange (message: object, routingKey?: string): boolean {
    if (this._channel) {
      const messageToSend = Buffer.from(JSON.stringify(message));
      routingKey = routingKey ? routingKey : this._settings.queue;
      return this._channel.publish(this._settings.exchange, routingKey, messageToSend);
    } else {
      throw Error('Channel not set up.');
    }
  }

  public consume (callback: (message: amqMessage) => Promise<ConsumerResponse>, consumeDLE: boolean = false): void {
    if (this._channel) {
      const channel = this._channel;
      const queue = consumeDLE ? this._settings.dleQueue : this._settings.queue;
      channel.consume(queue, async (message) => {
        if (message) {
          const consumerResponse = await callback(message).then();
          this.sendResponseToChannel(consumerResponse, channel, message);
        }
      }, {
        noAck: false
      });
    } else {
      throw Error('Channel not set up.');
    }
  }

  public async consumeDLE (callback: (message: amqMessage) => Promise<ConsumerResponse>): Promise<void> {
    return this.consume(callback, true);
  }

  public close (): Promise<void> {
    return new Promise((resolve) => {
      if (!this._channel) {
        return resolve();
      }
      this._channel.close(() => {
        console.info('Channel closed');
        this._channel = undefined;
        return resolve();
      });
    });
  }
  
  public closeConnection (): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.close();

      if (!this._connection) {
        return resolve();
      }
      this._connection.close((err?: any) => {
        if (err) {
          return reject(err);
        }
        console.info('Connection closed');
        this._connection = undefined;
        return resolve();
      });
    });
  }

  private sendResponseToChannel (consumerResponse: ConsumerResponse, channel: Channel, message: amqMessage) {
    if (consumerResponse.processed) {
      channel.ack(message);
    } else {
      channel.reject(message, consumerResponse.requeue);
    }
  }
}
