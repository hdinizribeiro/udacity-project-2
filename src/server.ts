import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './handlers/product';
import cors from 'cors';

const app: express.Application = express();
const address = '0.0.0.0:3000';

const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

productRoutes(app);

app.listen(3000, function () {
  // eslint-disable-next-line no-console
  console.log(`starting app on: ${address}`);
});

export default app;
