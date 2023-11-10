/**
 * @file For RabbitMQ access.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
import Config from '../dataStructs/config';
// eslint-disable-next-line @typescript-eslint/naming-convention
import RoomServiceMqConsumer, { RoomEvent } from './room_service_mq_consumer';

const config = Config.get();

/**
 *
 */
async function consumerClassExample(): Promise<void> {
  // Configs for MQ client
  // It is recommended that you set these via environment variables
  const consumer: RoomServiceMqConsumer = new RoomServiceMqConsumer({
    password: config.roomMQPass,
    user: config.roomMQUser,
    host: config.roomMQHost,
    port: config.roomMQPort,
    vhost: config.roomMQVhost, // Vhost is a non-empty string in production
    shouldUseTls: config.roomMQTls, // TLS will be used during production
    exchangeName: config.roomMQXchange,

    // This is completely up to you. I recommend the format
    // "xxx-service-room-event-queue".
    // By specifying a queue name, you can connect back to the queue and resume
    // from where you left off should a disconnect from the MQ occur.
    queueName: config.roomMQQname,
  });

  // Ensures setup is complete
  await consumer.initialise();

  // Consume messages by calling the specified  callback every time a message is
  // received
  await consumer.consume(async (data: RoomEvent) => {
    // Note that the "consume" method renames the event's field names to camel
    // case.
    console.log(`Received: ${JSON.stringify(data)}`);
  });
}

// TODO: Uncomment this to see a simple example
// simpleExample();

// TODO: Uncomment this to see the example which utilises my
// RoomServiceMqConsumer class
// consumerClassExample();
