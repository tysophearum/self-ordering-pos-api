import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Category } from 'src/category/schema/category.schema';
import { Types } from 'mongoose';
import { AdditionalProductRelation } from 'src/additional-product-relation/schema/additional-product-relation.schema';
import { Price } from 'src/price/schema/price.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel,
    @InjectModel(Category.name) private categoryModel,
    @InjectModel(AdditionalProductRelation.name) private relationModel,
    @InjectModel(Price.name) private priceModel,
    private imageService: UploadFileService,
  ) { }

  async createProduct(createProductDto: CreateProductDto, imageFile?: any): Promise<Product> {
    let category = await this.categoryModel.findById(createProductDto.categoryId)
    if (category == null) {
      throw new HttpException({ success: false, message: "Input categoryId does not exist" }, HttpStatus.NOT_FOUND);
    }
    try {
      let image = null
      if(imageFile) {
        image = this.imageService.saveImage(imageFile, './asset/image/products')
      }

      let newProduct = await this.productModel.create({
        name: createProductDto.name,
        price: createProductDto.price,
        categoryId: createProductDto.categoryId,
        image: image,
        show: 'true'
      })

      await this.priceModel.create({
        name: "តូច",
        productId: newProduct._id,
        price: newProduct.price
    })

      return newProduct;
    } catch (error) {
      throw new HttpException(error, 400)
    }
  }

  async deleteProduct(id: string): Promise<any> {
    try {
      const deleteProduct = await this.productModel.findById(id)
      this.relationModel.deleteMany({productId: deleteProduct._id})
      this.priceModel.deleteMany({productId: deleteProduct._id})
      if(deleteProduct.image) {
        this.imageService.deleteFile(deleteProduct.image)
      }
      await deleteProduct.deleteOne()
      return {
        success: true,
        message: "Product was deleted"
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async updateProduct(productUpdate: UpdateProductDto, imageFile?: any): Promise<Product> {
    try {
      let product = await this.productModel.findById(productUpdate._id)
      if (productUpdate.name) {
        product.name = productUpdate.name
      }
      if (productUpdate.categoryId) {
        let category = await this.categoryModel.findById(productUpdate.categoryId)
        if (category == null) {
          throw new HttpException({ success: false, message: "Input categoryId does not exist" }, HttpStatus.NOT_FOUND);
        }
        product.categoryId = productUpdate.categoryId
      }
      if (productUpdate.show) {
        product.show = productUpdate.show
      }
      if (productUpdate.price) {
        product.price = productUpdate.price
      }
      if (imageFile) {
        this.imageService.deleteFile(product.image)
        product.image = this.imageService.saveImage(imageFile, './asset/image/products')
      }
      return await product.save()
    } catch (error) {
      throw new HttpException(error.message, 400)
    }
  }

  async findAll(sortField?: string, sortOrder?: string): Promise<Product[]> {
    return this.productModel
      .aggregate([
        {
          $lookup: {
            from: 'additionalproductrelations',
            localField: '_id',
            foreignField: 'productId',
            as: 'relations',
          },
        },
        {
          $lookup: {
            from: 'additionalproducts',
            localField: 'relations.additionalProductId',
            foreignField: '_id',
            as: 'additionalProducts',
          },
        },
        {
          $lookup: {
            from: 'prices',
            localField: '_id',
            foreignField: 'productId',
            as: 'prices',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            show: 1,
            categoryId: 1,
            price: 1,
            additionalProducts: {
              $map: {
                input: "$additionalProducts",
                as: "additionalProduct",
                in: {
                  $mergeObjects: [
                    "$$additionalProduct",
                    {
                      relation: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$relations",
                              as: "relation",
                              cond: {
                                $eq: ["$$relation.additionalProductId", "$$additionalProduct._id"]
                              }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            },
            prices: 1,
          },
        },
        {
          $sort: {
            [sortField]: sortOrder === 'asc' ? 1 : -1,
          },
        },
      ])
      .exec();
  }
  

  async findOne(productId: string): Promise<any> {
    const productObjectId = new Types.ObjectId(productId);
    
    return await this.productModel.aggregate([
      {
        $match: {
          _id: productObjectId,
        },
      },
      {
        $lookup: {
          from: 'additionalproductrelations',
          localField: '_id',
          foreignField: 'productId',
          as: 'relations',
        },
      },
      {
        $lookup: {
          from: 'additionalproducts',
          localField: 'relations.additionalProductId',
          foreignField: '_id',
          as: 'additionalProducts',
        },
      },
      {
        $lookup: {
          from: 'prices',
          localField: '_id',
          foreignField: 'productId',
          as: 'prices',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          show: 1,
          price: 1,
          additionalProducts: 1,
          prices: 1,
        },
      },
    ]).then(products => products[0]); // Return the first product found
  }

  async searchProducts(query: string,sortField?: string, sortOrder?: string): Promise<Product[]> {
    const searchRegex = new RegExp(query, 'i');

    return this.productModel.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: searchRegex } },
            // Add more fields to search here, if needed
          ],
        },
      },
      {
        $lookup: {
          from: 'additionalproductrelations',
          localField: '_id',
          foreignField: 'productId',
          as: 'relations',
        },
      },
      {
        $lookup: {
          from: 'additionalproducts',
          localField: 'relations.additionalProductId',
          foreignField: '_id',
          as: 'additionalProducts',
        },
      },
      {
        $lookup: {
          from: 'prices',
          localField: '_id',
          foreignField: 'productId',
          as: 'prices',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          show: 1,
          categoryId: 1,
          price: 1,
          additionalProducts: {
            $map: {
              input: "$additionalProducts",
              as: "additionalProduct",
              in: {
                $mergeObjects: [
                  "$$additionalProduct",
                  {
                    relation: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$relations",
                            as: "relation",
                            cond: {
                              $eq: ["$$relation.additionalProductId", "$$additionalProduct._id"]
                            }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          },
          prices: 1,
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === 'asc' ? 1 : -1,
        },
      },
    ])
    .exec();
  }

  async showVisible(sortField?: string, sortOrder?: string): Promise<Product[]> {
    return this.productModel
      .aggregate([
        {
          $match: { show: 'true' }, // Filter products with show = 'true'
        },
        {
          $lookup: {
            from: 'additionalproductrelations',
            localField: '_id',
            foreignField: 'productId',
            as: 'relations',
          },
        },
        {
          $lookup: {
            from: 'additionalproducts',
            localField: 'relations.additionalProductId',
            foreignField: '_id',
            as: 'additionalProducts',
          },
        },
        {
          $lookup: {
            from: 'prices',
            localField: '_id',
            foreignField: 'productId',
            as: 'prices',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            show: 1,
            categoryId: 1,
            price: 1,
            additionalProducts: {
              $map: {
                input: "$additionalProducts",
                as: "additionalProduct",
                in: {
                  $mergeObjects: [
                    "$$additionalProduct",
                    {
                      relation: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$relations",
                              as: "relation",
                              cond: {
                                $eq: ["$$relation.additionalProductId", "$$additionalProduct._id"]
                              }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            },
            prices: 1,
          },
        },
        {
          $sort: {
            [sortField]: sortOrder === 'asc' ? 1 : -1,
          },
        },
      ])
      .exec();
  }

  async showInvisible(sortField?: string, sortOrder?: string): Promise<Product[]> {
    return this.productModel
      .aggregate([
        {
          $match: { show: 'false' }, // Filter products with show = 'true'
        },
        {
          $lookup: {
            from: 'additionalproductrelations',
            localField: '_id',
            foreignField: 'productId',
            as: 'relations',
          },
        },
        {
          $lookup: {
            from: 'additionalproducts',
            localField: 'relations.additionalProductId',
            foreignField: '_id',
            as: 'additionalProducts',
          },
        },
        {
          $lookup: {
            from: 'prices',
            localField: '_id',
            foreignField: 'productId',
            as: 'prices',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            show: 1,
            categoryId: 1,
            price: 1,
            additionalProducts: {
              $map: {
                input: "$additionalProducts",
                as: "additionalProduct",
                in: {
                  $mergeObjects: [
                    "$$additionalProduct",
                    {
                      relation: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$relations",
                              as: "relation",
                              cond: {
                                $eq: ["$$relation.additionalProductId", "$$additionalProduct._id"]
                              }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            },
            prices: 1,
          },
        },
        {
          $sort: {
            [sortField]: sortOrder === 'asc' ? 1 : -1,
          },
        },
      ])
      .exec();
  }

  async getCategory(categoryId: string, sortField?: string, sortOrder?: string): Promise<any> {
    const categoryObjectId = new Types.ObjectId(categoryId);
    return this.productModel.aggregate([
      {
        $match: {
          $and: [
            { categoryId: categoryObjectId },
            { show: 'true' }
            // Add more fields to search here, if needed
          ],
        },
      },
      {
        $lookup: {
          from: 'additionalproductrelations',
          localField: '_id',
          foreignField: 'productId',
          as: 'relations',
        },
      },
      {
        $lookup: {
          from: 'additionalproducts',
          localField: 'relations.additionalProductId',
          foreignField: '_id',
          as: 'additionalProducts',
        },
      },
      {
        $lookup: {
          from: 'prices',
          localField: '_id',
          foreignField: 'productId',
          as: 'prices',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          show: 1,
          categoryId: 1,
          price: 1,
          additionalProducts: {
            $map: {
              input: "$additionalProducts",
              as: "additionalProduct",
              in: {
                $mergeObjects: [
                  "$$additionalProduct",
                  {
                    relation: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$relations",
                            as: "relation",
                            cond: {
                              $eq: ["$$relation.additionalProductId", "$$additionalProduct._id"]
                            }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          },
          prices: 1,
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === 'asc' ? 1 : -1,
        },
      },
    ])
    .exec();
  }

  async getAllProductsWithOrderLines(): Promise<Product[]> {
    const productsWithOrderLines = await this.productModel.aggregate([
      {
        $lookup: {
          from: 'orderlines', // The name of the OrderLine collection in your MongoDB
          localField: '_id', // The field from the Category model to match
          foreignField: 'productId', // The field from the OrderLine model to match
          as: 'orderLines', // The name of the new field that will contain the matched orderLines
        },
      },
    ]);

    productsWithOrderLines.forEach(product => {
        let orderAmount = 0
        product.orderLines.forEach(orderLine => {
            orderAmount = orderAmount + orderLine.quantity
        });
        product.orderAmount = orderAmount
    });
    
    productsWithOrderLines.sort((a, b) => b.orderAmount - a.orderAmount);

    return productsWithOrderLines;
  }

  async getCategoryProductsWithOrderLines(categoryId: string): Promise<Product[]> {
    const categoryObjectId = new Types.ObjectId(categoryId);
    const productsWithOrderLines = await this.productModel.aggregate([
      {
        $match: { 
          categoryId: categoryObjectId,
        },
      },
      {
        $lookup: {
          from: 'orderlines', // The name of the OrderLine collection in your MongoDB
          localField: '_id', // The field from the Category model to match
          foreignField: 'productId', // The field from the OrderLine model to match
          as: 'orderLines', // The name of the new field that will contain the matched orderLines
        },
      },
    ]);

    productsWithOrderLines.forEach(product => {
        let orderAmount = 0
        product.orderLines.forEach(orderLine => {
            orderAmount = orderAmount + orderLine.quantity
        });
        product.orderAmount = orderAmount
    });
    
    productsWithOrderLines.sort((a, b) => b.orderAmount - a.orderAmount);

    return productsWithOrderLines;
  }

  async getAllProductsWithAdditionalProductsAndPrices(): Promise<Product[]> {
    return this.productModel.aggregate([
      {
        $lookup: {
          from: 'additionalproductrelations',
          localField: '_id',
          foreignField: 'productId',
          as: 'relations',
        },
      },
      {
        $lookup: {
          from: 'additionalproducts',
          localField: 'relations.additionalProductId',
          foreignField: '_id',
          as: 'additionalProducts',
        },
      },
      {
        $lookup: {
          from: 'prices',
          localField: '_id',
          foreignField: 'productId',
          as: 'price',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          show: 1,
          additionalProducts: 1,
          price: 1,
          relations: 1
        },
      },
    ]);
  }
}
