export interface QueueSettings {
  connectionURL: string;
  queue: string;
  dleQueue: string;
  exchange: string;
  exchangeType?: string;
}
