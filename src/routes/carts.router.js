import { Router } from "express";
import CartsManager from "../controllers/cartController.js";

const cartsRouter = Router();
const cartsManager = new CartsManager();

cartsRouter.post('/', (req, res) => cartsManager.agregarCarrito(req, res));

cartsRouter.get('/', (req, res) => cartsManager.obtenercarritos(req, res));

cartsRouter.get('/:cid', (req, res) => cartsManager.obtenercarritoPorId(req, res));

cartsRouter.post('/:cid/products/:pid', 
    (req, res, next) => cartsManager.checkearStatusProducto(req, res, next), 
    (req, res) => cartsManager.productoEnCarrito(req, res)
);

export default cartsRouter;