import Products from "../schemas/products.schemas.js";

export default class ProductsRepository {
  getAll = async (page, limit, sort) => {
    return await Products.paginate({}, { page, limit, sort, lean: true });
  };

  getById = async (id) => {
    return await Products.findOne({ code: { $eq: id } });
  };

  createOne = async (product) => {
    return await Products.create(product);
  };

  createMany = async (products) => {
    return await Products.insertMany(products);
  };

  updateById = async (id, product) => {
    return await Products.updateOne({ code: id }, product);
  };

  deleteByID = async (id) => {
    return await Products.deleteOne({ code: { $eq: id } });
  };
}
