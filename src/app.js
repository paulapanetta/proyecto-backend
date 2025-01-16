import express from "express"; 
import { engine } from "express-handlebars";
import { Server } from "socket.io";
const app = express(); 
const PUERTO = 8080; 

import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";

app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars"); 
app.set("views", "./src/views"); 

app.use("/api/products", productsRouter); 
app.use("/api/carts", cartsRouter); 
app.use("/", viewsRouter); 

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto: ${PUERTO}`);
})


import ProductManager from "./controllers/productsController.js";
const manager = new ProductManager("./src/data/productos.json"); 

const io = new Server(httpServer); 

io.on("connection", async (socket) => {
  console.log("Un cliente se conecto");

  socket.emit("productos", await manager.getProducts()); 

  socket.on("agregarProducto", async (producto) => {
    await manager.addProduct(producto); 
    io.sockets.emit("productos", await manager.getProducts())
  })


  socket.on("eliminarProducto", async (id) => {
    console.log(id);  
  })

})
