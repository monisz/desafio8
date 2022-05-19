const express = require('express');
const multer = require('multer');
const app = express();

const Container = require('./container');
const fileName = new Container ("productos.txt");

const routerProducts = express.Router();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: 'myFiles',
    filename: (req, file, cb) => {
        const nombreArchivo = file.fieldname
        cb(null, nombreArchivo)
    }
});

const uploader = multer({storage: storage});

routerProducts.get('/agregar', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

//Para obtener un producto según su id
routerProducts.get('/:id', (req, res) => {
    const getProduct = async () => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).send({error: "el parámetro no es un número"});
        const product = await fileName.getById(id);
        if (!product) res.status(404).send({error: "producto no encontrado"});
        else res.send(product);
    }
    getProduct();
})

//Para agregar un producto, y lo devuelve con su id
routerProducts.post('/', uploader.single('archivoASubir'), (req, res) => {
    const newProduct = req.body;
    console.log(req.body)
    const getProducts = async () => {
        const newId = await fileName.save(newProduct);
        res.send(newProduct);
    };
    getProducts();
});

//Recibe y actualiza un producto por id,
//como no pedía ninguna devolución, decidí que devuelva el producto completo
routerProducts.put('/:id', (req, res) => {
    const updateProduct = async () => {
        const id = parseInt(req.params.id);
        const newProduct = await fileName.replaceById(id, req.body);
            console.log(newProduct);
            if (!newProduct) res.status(404).send({error: "producto no encontrado"});
            else res.send(newProduct);    
    }
    updateProduct();
});

//Para borrar un producto según el id
routerProducts.delete('/:id', (req, res) => {
    const deleteProduct = async () => {
        const id = parseInt(req.params.id);
        const result = await fileName.deleteById(id);
        if (!result) res.status(404).send({error: "producto no encontrado"});
        else res.send("producto eliminado");
    }
    deleteProduct();
})

//Devuelve todos los productos
routerProducts.get('/', (req, res) => {
    const getProducts = async () => {
        const products = await fileName.getAll();
        res.json(products);
    };
    getProducts();
});

app.use('/api/productos', routerProducts);

app.listen(8080, () => {
    console.log("escuchando desafio 8");
});



