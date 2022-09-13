import { createClient } from 'redis'

const redisUrl = 'redis://redis:6379'
const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect()
    console.log('Redis client connected...')
  } catch (err: unknown) {
    console.log(err)
    setTimeout(connectRedis, 5000)
  }
};

connectRedis()

redisClient.on('error', (err) => {console.log(err)})

export default redisClient
