import express from 'express';
import './config/env.config';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  public config(): void {
    this.app.set('port', process.env.PORT);
  }

  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log(
        'Server is running at http://localhost:%d',
        this.app.get('port')
      );
    });
  }
}

const server = new Server();
server.start();
