const {Kafka} = require('kafkajs')
const consumer = kafka.consumer({groupId: 'test-group'})

await consumer.connect()
const pattern = `${"project"}-${"deploy"}`
await consumer.subscribe({topic: pattern, fromBeginning: true})

await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
        console.log({
            value: message.value.toString(),
        })
    },
})
