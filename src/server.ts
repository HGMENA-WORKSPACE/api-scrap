import express from 'express';
import request from 'request';
import { Readable } from 'stream';
import appConfig from './appConfig';
import { readStream, writeFile } from './utils';

/**
 *
 */
export default function Server(): void {
  ServerConnection.serverInstance;
}

class ServerConnection {
  private static _instance: ServerConnection;
  private app: express.Application;
  private array: string[] = [];
  private urlServer: string;
  private port: number;
  private fcn: number;
  private cn: number;

  /**
   * Devuelve la instacia de this
   */
  public static get serverInstance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    const { url_server, fcn, cn, server_port } = appConfig();
    this.urlServer = url_server;
    this.fcn = fcn;
    this.cn = cn;
    this.port = server_port;
    this.app = express();
    this.init();
  }

  /**
   *
   */
  init() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      next();
    });
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto ${this.port}`);
    });
    this.requestItems();
    this.get();
  }

  /**
   *
   */
  requestItems() {
    const url = this.urlServer + this.cn;
    this.handlerRequest(url);
  }

  handlerRequest(url: string) {
    request(url, (error: any, resonse: Readable, body: string) => {
      if (body) this.array.push(body);
      if (error) console.log(this.cn, error['code']);
      if (this.cn >= this.fcn) {
        writeFile(this.array);
      } else {
        this.cn++;
        this.requestItems();
      }
    });
  }

  /**
   *
   * @param url
   */
  get() {
    this.app.get('/:file_name', async (req, res) => {
      const { file_name } = req.params;
      if (file_name !== 'favicon.ico') {
        const stream = await readStream(`./${file_name}`);
        stream.pipe(res);
      }
    });
  }
}
