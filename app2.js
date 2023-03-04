import { connect } from "amqplib";

const queueName = "mi-cola";

async function consumeMessage() {
  try {
    const connection = await connect({
      hostname: "localhost",
      username: "bianel",
      password: "1172459",
      port: 5672,
      vhost: "/",
      protocol: "amqp",

    });
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    console.log("Waiting for messages...");
    channel.consume(queueName, (msg) => {
      console.log(`Received message: ${msg.content.toString()}`);
      channel.ack(msg);
    });
  } catch (error) {
    console.log(error);
  }
}

consumeMessage();
