import mongoose, { ConnectOptions } from 'mongoose';

export default () => {
  const { connection } = mongoose;

  connection?.on('connected', () => {
    console.log('MongoDB connection established');
  });

  connection?.on('reconnected', () => {
    console.log('MongoDB connection re-established');
  });

  connection?.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
    console.log('Trying to reconnect');
    setTimeout(() => {
      mongoose.connect(
        process.env.APP_DB_URL as string,
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        } as ConnectOptions
      );
    }, 3000);
  });

  connection?.on('close', () => {
    console.log('MongoDB connected closed');
  });

  connection?.on('error', (error: Error) => {
    console.log('MongoDB connection error: ', error);
  });

  const run = async () => {
    await mongoose.connect(process.env.APP_DB_URL as string, {
      keepAlive: true,
    });
  };

  run().catch((error) => console.error(error));
};
