import newProductDTO from "../DAO/DTO/newProduct.dto.js";
import productsDao from "../DAO/products.dao.js";
import HTTPError from "../DAO/repository/errors.repository.js";
import { nodemailer_user } from "../config/mailer.config.js";
import MailerDao from "../DAO/mailer.dao.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortObj = {};
    const sortOption = req.query.sort;

    if (sortOption === "asc" || sortOption === "desc") {
      sortObj.price = sortOption;
    } else if (sortOption == "cat") {
      sortObj.category = 1;
    } else if (sortOption == "stock") {
      sortObj.stock = -1;
    }

    const data = await productsDao.getAll(page, limit, sortObj);

    data.user = req.session.user;

    data.prevLink = data.hasPrevPage
      ? `/api/products?page=${data.prevPage}&limit=${limit}${
          sortOption ? `&sort=${sortOption}` : ``
        }`
      : null;
    data.nextLink = data.hasNextPage
      ? `/api/products?page=${data.nextPage}&limit=${limit}${
          sortOption ? `&sort=${sortOption}` : ``
        }`
      : null;
    res.render("products", data);
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
    if (
      req.session.user.role !== "premium" &&
      req.session.user.role !== "admin"
    ) {
      throw new HTTPError("Forbiden", 401);
    }
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
    if (
      user.role === "administrador" ||
      (user.email !== "premium" && product.owner !== "premium")
    ) {
      return new HTTPError("Unauthorized", 401);
    }
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
    const user = req.session.user;

    if (user.role === "premium") {
      const mailOptions = {
        from: nodemailer_user,
        to: user.email,
        subject: `Deleted product ID: ${pid}`,
        text: `Your product by name: ${product.name}, has been deleted.`,
      };

      await MailerDao.sendMail(mailOptions);
    }
    if (!product) {
      res.status(404).send(`The product with code ${pid} doesn't exists.`);
      return;
    }

    if (user.role === "administrador" || user.role === product.owner) {
      await productsDao.deleteByID(pid);
      res.send(`Product wirth code ${pid}, deleted successfully`);
    }
  } catch (error) {
    console.log(error);
    logger.error("Error ocurred deleting the product", error);
    next(error);
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
