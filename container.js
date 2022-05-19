const fs = require('fs');

class Container {
    constructor (fileName) {
        this.fileName = fileName;
        this.id = 1;
    }    

    async save(product) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            const contentParse = JSON.parse(content);
            product['id'] = contentParse.length + 1;
            contentParse.push(product);
            try {
                await fs.promises.writeFile('productos.txt', JSON.stringify(contentParse, null, 2));
                console.log("escritura exitosa");
            }
            catch (error) {
                console.log("el error al escribir fue: ", error);
            }
            return product.id;
        }
        catch (error) {
            console.log("error al leer (en Save): ", error);
        }
    }

    //Agregué este método para complementar el put por id
    async replaceById(id, data) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            const contentParse = JSON.parse(content);
            data["id"] = id;
            contentParse[id-1] = data;
            try {
                await fs.promises.writeFile('productos.txt', JSON.stringify(contentParse, null, 2));
                console.log("escritura exitosa");
            }
            catch (error) {
                console.log("el error al escribir fue: ", error);
            }
            return contentParse[id-1];
        }
        catch (error) {
            console.log("error al leer (en Save): ", error);
        }
    }

    async getById(id) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            const contentParse = JSON.parse(content);
            const objectFinded = contentParse.find((obj) => obj.id === id);
            if (objectFinded) {
                return objectFinded;
            } else {
                return null;
            }
        }
        catch (error) {
            console.log("error al buscar por id: ", error);
        }
    }

    async getAll() {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            const contentParse = JSON.parse(content);
            return contentParse;
        }
        catch (error) {
            console.log("error al leer (en getAll): ", error)
            return [];
        }
    }

    async deleteById(id) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            const contentParse = JSON.parse(content);
            contentParse.splice((id-1),1);
            try {
                await fs.promises.writeFile('productos.txt', JSON.stringify(contentParse, null, 2));
                console.log("escritura exitosa en deleteById");
            }
            catch (error) {
                console.log("el error al escribir (en deleteById) fue: ", error);
            }
            return contentParse;
        }
        catch (error) {
            console.log("error al leer (en deleteById): ", error);
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile('productos.txt', "[]");
            console.log("borrado exitoso");
        }
        catch (error) {
            console.log("el error al borrar el archivo fue: ", error);
        }
    }
}

const fileName = "productos.txt";

const file1 = new Container (fileName);

const product1 = {title: "Secador GA.MA", price: 2000, thumbnail: "una imagen"};
const product2 = {title: "Planchita GA.MA", price: 5000, thumbnail: "otra imagen"};
const product3 = {title: "Cepillo GA.MA", price: 1000, thumbnail: "otra imagen"};
const newData = {title: "cuchara", price: 200, thumbnail: "otra imagen"};

const mainProduct = async () => {
    await file1.save(product1)
        .then((id) => console.log("Id del producto guardado", id));
    await file1.save(product2)
        .then((id) => console.log("Id del producto guardado", id));
    console.log("contenido de todo el archivo", await file1.getAll());    
    await file1.getById(2)
        .then((result) => console.log("producto con id 2: ", result));
    await file1.getById(3)
        .then((result) => console.log("producto con id 3: ", result));
    await file1.save(product3)
        .then((id) => console.log("Id del producto guardado", id));
    await file1.replaceById(1, newData)
        .then((result) => console.log("producto cambiado ", result))
    //Estos dos métodos están comentados, porque si no el archivo se borra 
    //antes de poder ver el contenido. Descomentar para probarlos
    //await file1.deleteById(3);
    //await file1.deleteAll();
}

//Para chequear si existe el archivo
const fileExists = fs.existsSync(fileName);
console.log("primero", fileExists);
if (!fileExists) {
    fs.writeFileSync(fileName, "[]");
    console.log("archivo creado");
};

//mainProduct();

module.exports = Container;

