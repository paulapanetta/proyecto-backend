import express from 'express';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
const PUERTO = 8080;

const app = express();
app.use(express.json()); 
app.use(express({urlencoded:true}))

app.get('/api', (req, res)=>{
    res.send('Primer entrega del proyecto.')
});
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('*', (req, res, next) => {
    res.status(404).send('No existe la pagina');
    next()
});

app.listen(PUERTO, () => {
    console.log(`Escuchando en puerto ${PUERTO}`);
});