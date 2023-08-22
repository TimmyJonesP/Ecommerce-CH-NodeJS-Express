import { faker } from "@faker-js/faker/locale/es";

export const generateProductsList = (role, email) => {
  let products = [];
  for (let i = 0; i < 5; i++) {
    products.push(generateProduct(role, email));
  }
  return products;
};

export const generateProduct = (role, email) => {
  const owner = role == "admin" ? "admin" : email;

  return {
    code: faker.string.numeric(6),
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    stock: faker.string.numeric(2),
    owner: owner,
  };
};
