import * as amqp from 'amqplib/callback_api';
import {ConsumerResponse, QWrapperSettings, Message} from "../models";
import {Channel, Message as amqMessage} from "amqplib/callback_api";

export class QWrapperDomain {

  private _settings: QWrapperSettings;
  private _channel: amqp.Channel | undefined;

  constructor(settings?: QWrapperSettings) {
    if (!settings) {
      settings = {
        queue: '',
        dleQueue: '',
        connection: '',
        exchange: '',
        exchangeType: 'direct'
      };
    }

    this._settings = settings;
  }

  // @ts-ignore
  get settings(): QWrapperSettings {
    return this._settings;
  }

  // @ts-ignore
  set settings(settings: QWrapperSettings) {
    settings.exchangeType = settings.exchangeType ? settings.exchangeType : 'direct';

    this._settings = settings;
  }

  public initialize(): Promise<boolean> {
    return new Promise((resolve) => {
      amqp.connect(this._settings.connection, (error0, connection) => {
        if (error0) {
          console.error('Error connecting to queue... ', error0);
          throw error0;
        }

        connection.createChannel((error1, channel) => {
          if (error1) {
            console.error('Error creating channel... ', error1);
            throw error1;
          }

          console.info('Channel created successfully');

          // @ts-ignore
          channel.assertExchange(this._settings.exchange, this._settings.exchangeType, {
            durable: true
          });

          channel.assertQueue(this._settings.dleQueue, {
            durable: true,
          });

          channel.bindQueue(this._settings.dleQueue, this._settings.exchange, this._settings.dleQueue);

          channel.assertQueue(this._settings.queue, {
            durable: true,
            deadLetterExchange: this._settings.exchange,
            deadLetterRoutingKey: this._settings.dleQueue
          });

          channel.bindQueue(this._settings.queue, this._settings.exchange, this._settings.queue);

          channel.prefetch(1);

          this._channel = channel;

          return resolve(true);
        });
      });
    });
  }

  public sendToQueue(message: object, queueName?: string): boolean {
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

  public sendToExchange(message: object, exchange?: string, routingKey?: string): boolean {
    if (this._channel) {
      const messageToSend = Buffer.from(JSON.stringify(message));
      exchange = exchange? exchange : this._settings.exchange;
      routingKey = routingKey? routingKey : this._settings.queue;
      return this._channel.publish(exchange, routingKey, messageToSend);
    } else {
      throw Error('Channel not set up.');
    }
  }

  public async consumeAsync(callback: (message: Message) => Promise<ConsumerResponse>, queueName?: string): Promise<void> {
    if (this._channel) {
      const channel = this._channel;
      const queue = queueName ? queueName : this._settings.queue;
      channel.consume(queue, async (message) => {
        if (message) {
          const consumerResponse = await callback(message);
          this.sendResponseToChannel(consumerResponse, channel, message);
        }
      }, {
        noAck: false
      });
    } else {
      throw Error('Channel not set up.');
    }
  }

  public async consumeDLEAsync(callback: (message: Message) => Promise<ConsumerResponse>): Promise<void> {
    return this.consumeAsync(callback, this._settings.dleQueue);
  }

  public consume(callback: (message: Message) => ConsumerResponse, queueName?: string): void {
    if (this._channel) {
      const channel = this._channel;
      const queue = queueName ? queueName : this._settings.queue;
      channel.consume(queue, (message) => {
        if (message) {
          const consumerResponse = callback(message);
          this.sendResponseToChannel(consumerResponse, channel, message);
        }
      }, {
        noAck: false
      });
    } else {
      throw Error('Channel not set up.');
    }
  }

  public consumeDLE(callback: (message: Message) => ConsumerResponse): void {
    this.consume(callback, this._settings.dleQueue);
  }

  public close(): void {
    if (this._channel) {
      this._channel.close(() => {
        console.info('Channel closed');
      });
    }
  }

  private sendResponseToChannel(consumerResponse: ConsumerResponse, channel: Channel, message: amqMessage) {
    if (consumerResponse.processed) {
      channel.ack(message);
    } else {
      channel.reject(message, consumerResponse.requeue);
    }
  }

}

export default new QWrapperDomain();
