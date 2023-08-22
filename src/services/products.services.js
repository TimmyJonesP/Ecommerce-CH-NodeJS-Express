import newProductDTO from "../DAO/DTO/newProduct.dto.js";
import productsDao from "../DAO/products.dao.js";

export const getAllProducts = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    let sortObj = {};
    let sortOption = req.query.sort;

    if (sortOption === "asc" || sortOption === "desc") {
      sortObj.price = sortOption;
    } else if (sortOption == "cat") {
      sortObj.category = 1;
    } else if (sortOption == "stock") {
      sortObj.stock = -1;
    }

    const data = await productsDao.getAll(page, limit, sortObj);
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getOneProduct = async (req, res, next) => {
  try {
    let pid = req.params.pid;
    let productData = await productsDao.getById(pid);

    if (productData) {
      productData.user = req.session.user;
      res.json(productData);
    } else {
      res.status(404).send(`Cannot find product with code: ${pid}`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    let product = newProductDTO(req.body);
    await productsDao.createOne(product);
    res
      .status(201)
      .send(`Product with code ${product.code} created successfully`);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    let pid = req.params.pid;
    let { name, description, price, stock, category, thumbnail } = req.query;

    const data = await productsDao.getById(pid);
    if (!data) {
      res.status(404).send(`No existing product with id ${pid}`);
      return;
    }

    const updatedProduct = {
      name: name || data.name,
      description: description || data.description,
      price: price || data.price,
      stock: stock || data.stock,
      category: category || data.category,
      thumbnail: thumbnail || data.thumbnail,
    };

    await productsDao.updateById(pid, updateProduct);
    res.send(`Product with id: ${pid} has been actualized`);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while updating the product.");
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const product = await productsDao.getById(pid);
    if (!product) {
      res.status(404).send(`The product with code ${pid} doesn't exists.`);
      return;
    }
    await productsDao.deleteByID(pid);
    res.send(`Product wirth code ${pid}, deleted successfully`);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the product.");
  }
};

export const createMockingProducts = async (req, res, next) => {
  try {
    let products = generateProductsList(
      req.session.user.role,
      req.session.user.email
    );
    let productsData = await productsDao.createMany(products);
    res.status(200).send({
      status: "succesful",
      message: "mocking products generated correctly",
      data: productsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred white generating Mock products");
  }
};
