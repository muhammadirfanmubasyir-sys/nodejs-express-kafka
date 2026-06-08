import { Kafka } from "kafkajs";
import crypto from "crypto";

// Generate a random v4 UUID
 
const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9092","localhost:9095","localhost:9096"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "order-service" });

const run = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({
      topic: "payment-successful",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        const { userId, cart } = JSON.parse(value);

        // TODO: Create order on DB
        const dummyOrderId = crypto.randomUUID();
        console.log(`Order consumer: Order ${dummyOrderId} created for user id: ${userId}`);

        await producer.send({
          topic: "order-successful",
          messages: [
            { value: JSON.stringify({ userId, orderId: dummyOrderId }) },
          ],
        });
      },
    });
  } catch (err) {
    console.log(err);
  }
};

run();
