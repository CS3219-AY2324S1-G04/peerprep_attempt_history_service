/**
 * @file For RabbitMQ consumer.
 */
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/naming-convention
import Config from './config';
// eslint-disable-next-line @typescript-eslint/naming-convention
import RoomServiceMqConsumer, { RoomEvent } from './room_service_mq_consumer';

const config = Config.get();

/**
 * Creates consumer to consume deletion events.
 */
export async function consumer(): Promise<void> {
  // Configs for MQ client
  // It is recommended that you set these via environment variables
  const consumer: RoomServiceMqConsumer = new RoomServiceMqConsumer({
    user: config.roomMQUser,
    password: config.roomMQPass,
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
    // console.log(`Received: ${JSON.stringify(data)}`);

    if (data.eventType == 'remove-user') {
      let userCode = 'lorem ipsum';
      try {
        const getCode = await axios.get(
          config.docsServiceURL + '/docs-service/docs/' + data.room.roomId,
        );
        console.log(getCode.data.doc);
        userCode = getCode.data.doc;
      } catch (error) {
        console.error(error);
      }

      try {
        const requestBody = { code: userCode };
        const questionId = `question=${data.room.questionId}`;
        const roomId = `room=${data.room.roomId}`;
        const language = `language=${data.room.questionLangSlug}`;
        const userOne =
          `?user=${data.removedUserId}&${questionId}` +
          `&${roomId}&${language}`;
        await axios.post(
          config.attemptHistoryURL + '/attempt-history-service/add' + userOne,
          requestBody,
        );
      } catch (error) {
        console.error(error);
      }
    }
  });
}
