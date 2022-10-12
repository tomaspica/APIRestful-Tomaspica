const { promises: fs } = require("fs");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>
  console.log(`Server listening on PORT ${PORT}`)
);
const filtePath = "productos.json";

//Funciones
async function getAll() {
  try {
    const contenido = await fs.readFile(filtePath, "utf8");
    const elementos = JSON.parse(contenido);
    return elementos;
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filtePath, JSON.stringify([], null, 3));
      return [];
    }
    throw new Error(`${error.message}`);
  }
}
async function save(object) {
  try {
    const elementos = await getAll();
    const id =
      elementos.length === 0 ? 1 : elementos[elementos.length - 1].id + 1;
    object.id = id;
    elementos.push(object);
    await fs.writeFile(filtePath, JSON.stringify(elementos, null, 3));
    return object.id;
  } catch (error) {
    throw new Error(`El archivo no pudo manipularse, error: ${error.message}`);
  }
}

server.on("error", (err) => console.log(`Error: ${err}`));

app.use(express.json());

const routerProductos = require("./routes/routerProductos.js");

app.use("/api/productos", routerProductos);