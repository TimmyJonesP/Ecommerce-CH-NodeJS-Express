export default class newProductDTO {
  constructor(
    name,
    description,
    price,
    stock,
    code,
    category,
    thumbnail,
    owner
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.code = code;
    this.category = category;
    this.thumbnail = thumbnail;
    this.owner = owner;
  }
}
