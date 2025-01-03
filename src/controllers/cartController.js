import fs from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import { leerProducts, rutaProducts } from './productsController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const rutaCarts = path.join(__dirname, '../carts.json');

export let contadorCarts = 1;

export const inicializarArchivoCarts = async (rutaCarts) => {
    try {
        if (!existsSync(rutaCarts)) {
            await fs.writeFile(rutaCarts, JSON.stringify([]));
            contadorCarts = 1;
            console.log('Archivo creado');
            return;
        }
    } catch (error) {
        throw new Error(`Error iniciando el archivo: ${error.message}`);
    }
};

export const leerCarts = async (rutaCarts) => {
    try {
        await inicializarArchivoCarts(rutaCarts);
        const contenido = await fs.readFile(rutaCarts, 'utf-8');
        const datos = JSON.parse(contenido);

        if (datos.length > 0) {
            contadorCarts = Math.max(...datos.map(p => parseInt(p.id))) + 1;
        }
        if (datos.length === 0) {
            console.log('Lista vacia');
        }
        return datos;
    } catch (error) {
        console.error(`Error al leer datos: ${error.message}`);
    }
};

class CartsManager {
    async agregarCarrito(req, res) {
        const carritos = await leerCarts(rutaCarts);
        const nuevoCarrito = {
            id: contadorCarts,
            products: []
        };
        carritos.push(nuevoCarrito);
        await fs.writeFile(rutaCarts, JSON.stringify(carritos, null, 2));
        res.status(201).json(nuevoCarrito);
        console.log('Carrito creado');
    }

    async obtenercarritos(req, res) {
        const contenido = await leerCarts(rutaCarts);
        res.status(200).json(contenido);
    }

    async obtenercarritoPorId(req, res) {
        const { cid } = req.params;
        const contenido = await leerCarts(rutaCarts);
        const carrito = contenido.find(c => c.id == cid);
        if (carrito) {
            res.status(200).json(carrito.products);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    }

    async checkearStatusProducto(req, res, next) {
        const { pid } = req.params;
        const products = await leerProducts(rutaProducts);
        const producto = products.find(p => p.id === parseInt(pid));

        if (!producto) {
            return res.status(404).json({ message: 'No se encuentra el producto' });
        }

        if (!producto.status) {
            return res.status(405).json({ message: 'El producto no esta disponible' });
        }

        req.producto = producto;
        next();
    }

    async productoEnCarrito(req, res) {
        const { cid, pid } = req.params;
        const carritos = await leerCarts(rutaCarts);
        const carrito = carritos.find(c => c.id == cid);

        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productoEnCarrito = carrito.products.find(prod => prod.id === parseInt(pid));
        if (productoEnCarrito) {
            productoEnCarrito.quantity += 1;
        } else {
            carrito.products.push({ id: parseInt(pid), quantity: 1 });
        }

        await fs.writeFile(rutaCarts, JSON.stringify(carritos, null, 2));
        res.status(200).json(carrito);
    }
}

export default CartsManager;