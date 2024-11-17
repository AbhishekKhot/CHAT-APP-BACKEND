"use strict";

const { kafka, Kafka } = require("kafkajs");
const { name } = require("../package.json");

const kafka = new Kafka({
  clientId: name,
  brokers: process.env.KAFKA_BORKER_URL,
});

const producer = kafka.producer();
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
