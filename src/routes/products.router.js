import { Router } from 'express';
import ProductManager from '../controllers/productsController.js';

const productManager = new ProductManager();
const productsRouter = Router();

productsRouter.put('/:pid', productManager.actualizarProducto.bind(productManager)); 
productsRouter.get('/', productManager.obtenerLimite.bind(productManager)); 
productsRouter.get('/:pid', productManager.obtenerPorId.bind(productManager)); 
productsRouter.delete('/:pid', productManager.borrarProducto.bind(productManager)); 
productsRouter.post('/', productManager.agregarProducto.bind(productManager)); 
productsRouter.get('/all', productManager.obtenerTodo.bind(productManager)); 

export default productsRouter;