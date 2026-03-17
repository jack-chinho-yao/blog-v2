// @ts-check
const {Kafka} = require("kafkajs");

const kafka = new Kafka({
    clientId: "my-consumer",
    brokers: ["localhost:29092"],
});

const consumer = kafka.consumer({groupId: "another-group"});

const run = async () => {
    await consumer.connect();
    console.log("Consumer connected");

    await consumer.subscribe({topic: "blog-events", fromBeginning: true});

    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            console.log({
                topic,
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        },
    });
};

run().catch(console.error);
