import express from 'express';
import './config/env.config';
import cors from 'cors';
import bodyParser from 'body-parser';
import MongoDB from './config/connection.config';
import ApiRoute from './routes/api.route';
import ErrorHandler from './error-handler/error-handler';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    this.app.set('port', process.env.PORT);
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    MongoDB();
    this.app.use(cors());
    this.app.use(ErrorHandler);
  }

  public routes(): void {
    this.app.use('/api', new ApiRoute().router);
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
