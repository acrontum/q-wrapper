import { ConnectionOptions } from './ConnectionOptions';

export interface QWrapperSettings {
  connection: string | ConnectionOptions;
  queue: string;
  exchange: string;
  exchangeType: string;
  verboseLogging?: boolean;
  veryVerboseLogging?: boolean;
  reconnect?: boolean;
  prefetch?: number;
  dleQueue: string;
  dleExchange?: string;
}
