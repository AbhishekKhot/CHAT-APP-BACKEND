"use strict";

const { Kafka, Partitioners } = require("kafkajs");
const { name } = require("../package.json");

const kafka = new Kafka({
  clientId: name,
  brokers: process.env.KAFKA_BROKER_URL.split(","),
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
const consumer = kafka.consumer({ groupId: `${name}-consumer-group` });

async function initKafka() {
  try {
    await producer.connect();
    await consumer.connect();
    return { producer, consumer };
  } catch (error) {
    throw error;
  }
}

module.exports = initKafka;
