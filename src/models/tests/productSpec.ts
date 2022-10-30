import { Product, ProductStore } from '../product';

const sutProductStore = new ProductStore();

describe('Product Store Tests', () => {
  it('Should return all products', async () => {
    // Arrange
    const newProduct = await sutProductStore.create({
      name: 'Battery',
      price: '10'
    });

    // Act
    const result = await sutProductStore.index();

    // Assert
    expect(result.length).toBe(1);
    expect(result).toContain(newProduct);
  });

  it('Should create a product correctly', async () => {
    // Arrange
    const product: Product = {
      name: 'New Product',
      price: '25'
    };

    // Act
    const insertedProduct = await sutProductStore.create(product);

    // Assert
    product.id = insertedProduct.id;
    expect(insertedProduct).toEqual(product);
  });

  it('Should show a prodcut', async () => {
    // Arrange
    const newProduct = await sutProductStore.create({
      name: 'New Product to show',
      price: '35'
    });

    //Act
    const result = await sutProductStore.show(newProduct.id ?? 0);

    // Assert
    expect(result).toEqual(result);
  });
});
