import express from "express";
import { connect } from "amqplib";

const app = express();

const queueName = "mi-cola";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
        <form action="/send" method="POST">
            <input type="text" name="message" />
            <button type="submit">Send</button> 
        </form>
    `);
});

app.post("/send", async (req, res) => {
  try {
    const { message } = req.body;

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
    await channel.sendToQueue(queueName, Buffer.from(message));
    await channel.close();
    await connection.close();
    res.send("Message sent to RabbitMQ");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error sending message to RabbitMQ");
  }
});

app.listen(3000, () => {
  console.log("Sender app listening on port 3000");
});
