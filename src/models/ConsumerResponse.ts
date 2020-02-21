export interface ConsumerResponse {
  /**
   *  Indicates if the message was processed successfully
   */
  processed: boolean;
  /**
   * If true, the message will be sent to the queue in case of failure (processed = false).
   * If false, the message will be sent to the dead letter queue in case of failure (processed = false).
   */
  requeue: boolean;
}
