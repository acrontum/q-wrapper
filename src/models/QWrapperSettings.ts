import { ConnectionOptions } from './ConnectionOptions';

export enum ExchangeType {
  direct = 'direct',
  topic = 'topic',
  fanout = 'fanout',
}

export interface QWrapperSettings {
  connection: string | ConnectionOptions;
  dleExchange?: string;
  dleQueue: string;
  exchange: string;
  exchangeType: ExchangeType | string;
  prefetch?: number;
  queue: string;
  reconnect?: boolean;
  routingKey?: string,
  verboseLogging?: boolean;
  veryVerboseLogging?: boolean;
}
