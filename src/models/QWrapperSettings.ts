import { Options } from 'amqplib/properties';

export interface QWrapperSettings {
  connectionURL: string | Options.Connect;
  queue: string;
  dleQueue: string;
  exchange: string;
  exchangeType?: string;
}
