import express, { request, response } from 'express';
import PointsController from './controllers/PointsController';
import ItemController from './controllers/ItemsController';

const routes = express.Router();
const pointsController = new PointsController
const itemsController = new ItemController;

routes.get('/items', itemsController.index);

routes.post('/points',pointsController.create);
routes.get('/points/:id',pointsController.show);
routes.get('/points',pointsController.index);


export default routes;