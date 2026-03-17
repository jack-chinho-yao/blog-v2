const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "my-producer",
    brokers: ["localhost:29092"],
});

const producer = kafka.producer();

const run = async () => {
    await producer.connect();
    console.log("Producer connected");

    await producer.send({
        topic: "blog-events",
        messages: [{value: "Hello Kafka!"},
        ],
    });

    console.log("Message sent successfully");

    await producer.disconnect();

};

run().catch(console.error);
