import { HttpException, Injectable } from '@nestjs/common';
import { Order } from './schema/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderStatusDto } from './dto/updateStatus.dto';
import { Product } from 'src/product/schema/product.schema';
import { Price } from 'src/price/schema/price.schema';
import { ObjectId } from 'mongodb';
import { OrderLine } from 'src/order-line/schema/order-line.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel,
    @InjectModel(Product.name) private productModel,
    @InjectModel(Price.name) private priceModel,
    @InjectModel(OrderLine.name) private orderLineModel,
    
  ) { }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const count = await this.orderModel.countDocuments().exec();
      const lastTwoDigits = count % 100;
      return await this.orderModel.create({
        type: createOrderDto.type,
        totalPrice: createOrderDto.totlaPrice,
        status: 'waiting',
        orderNumber: lastTwoDigits+1
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findAll(sortField?: string, sortOrder?: string): Promise<Order[]> {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'orderlines',
            localField: '_id',
            foreignField: 'orderId',
            as: 'orderLines',
          },
        },
        {
          $unwind: {
            path: '$orderLines',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'orderLines.productId',
            foreignField: '_id',
            as: 'orderLines.product',
          },
        },
        {
          $unwind: {
            path: '$orderLines.product',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'prices',
            localField: 'orderLines.priceId',
            foreignField: '_id',
            as: 'orderLines.price',
          },
        },
        {
          $unwind: {
            path: '$orderLines.price',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'payments', 
            localField: '_id',
            foreignField: 'orderId',
            as: 'payments'
          },
        },
        {
          $unwind: {
            path: '$payments',
            preserveNullAndEmptyArrays: true,
          }
        },
        {
          $group: {
            _id: '$_id',
            totalPrice: { $first: '$totalPrice' },
            type: { $first: '$type' },
            status: { $first: '$status' },
            orderNumber: { $first: '$orderNumber' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            orderLines: { $push: '$orderLines' },
            payments: { $push: '$payments' },
          },
        },
        {
          $sort: {
            [sortField]: sortOrder === 'asc' ? 1 : -1,
          },
        },
      ];

      const takeoutOrdersWithOrderLines = await this.orderModel.aggregate(pipeline);

      return takeoutOrdersWithOrderLines;
    } catch (error) {
      throw error;
    }
  }


  async findDineIn(sortField?: string, sortOrder?: string): Promise<Order[]> {
    try {
      const pipeline = [
        {
          $match: { type: 'ញាំក្នុងហាង' },
        },
        {
          $lookup: {
            from: 'orderlines',
            localField: '_id',
            foreignField: 'orderId',
            as: 'orderLines',
          },
        },
        {
          $unwind: {
            path: '$orderLines',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'orderLines.productId',
            foreignField: '_id',
            as: 'orderLines.product',
          },
        },
        {
          $unwind: {
            path: '$orderLines.product',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'prices',
            localField: 'orderLines.priceId',
            foreignField: '_id',
            as: 'orderLines.price',
          },
        },
        {
          $unwind: {
            path: '$orderLines.price',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'payments', 
            localField: '_id',
            foreignField: 'orderId',
            as: 'payments'
          },
        },
        {
          $unwind: {
            path: '$payments',
            preserveNullAndEmptyArrays: true,
          }
        },
        {
          $group: {
            _id: '$_id',
            totalPrice: { $first: '$totalPrice' },
            type: { $first: '$type' },
            status: { $first: '$status' },
            orderNumber: { $first: '$orderNumber' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            orderLines: { $push: '$orderLines' },
            payments: { $push: '$payments' },
          },
        },
        {
          $sort: {
            [sortField]: sortOrder === 'asc' ? 1 : -1,
          },
        },
      ];

      const takeoutOrdersWithOrderLines = await this.orderModel.aggregate(pipeline);

      return takeoutOrdersWithOrderLines;
    } catch (error) {
      throw error;
    }
  }

    async findById(id: string) {
        try {
        const pipeline = await this.orderModel.aggregate([
            {
                $match: { _id: new ObjectId(id) },
            },
            {
                $lookup: {
                    from: 'orderlines',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderLines',
                },
            },
            {
                $unwind: {
                    path: '$orderLines',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderLines.productId',
                    foreignField: '_id',
                    as: 'orderLines.product',
                },
            },
            {
                $unwind: {
                    path: '$orderLines.product',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'prices',
                    localField: 'orderLines.priceId',
                    foreignField: '_id',
                    as: 'orderLines.price',
                },
            },
            {
                $unwind: {
                    path: '$orderLines.price',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
              $lookup: {
                from: 'payments',
                localField: '_id',
                foreignField: 'orderId',
                as: 'payments'
              },
            },
            {
              $unwind: {
                path: '$payments',
                preserveNullAndEmptyArrays: true
              }
            },
            {
                $group: {
                    _id: '$_id',
                    totalPrice: { $first: '$totalPrice' },
                    type: { $first: '$type' },
                    status: { $first: '$status' },
                    orderNumber: { $first: '$orderNumber' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                    orderLines: { $push: '$orderLines' },
                    payments: { $push: '$payments' }
                },
            },
        ]);
        return pipeline;
        } catch (error) {
        throw error;
        }
    }

  async findTakeOut(sortField?: string, sortOrder?: string): Promise<Order[]> {
    try {
      const pipeline = [
        {
          $match: { type: 'ខ្ចប់' },
        },
        {
          $lookup: {
            from: 'orderlines',
            localField: '_id',
            foreignField: 'orderId',
            as: 'orderLines',
          },
        },
        {
          $unwind: {
            path: '$orderLines',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'orderLines.productId',
            foreignField: '_id',
            as: 'orderLines.product',
          },
        },
        {
          $unwind: {
            path: '$orderLines.product',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'prices',
            localField: 'orderLines.priceId',
            foreignField: '_id',
            as: 'orderLines.price',
          },
        },
        {
          $unwind: {
            path: '$orderLines.price',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'payments', 
            localField: '_id',
            foreignField: 'orderId',
            as: 'payments'
          },
        },
        {
          $unwind: {
            path: '$payments',
            preserveNullAndEmptyArrays: true,
          }
        },
        {
          $group: {
            _id: '$_id',
            totalPrice: { $first: '$totalPrice' },
            type: { $first: '$type' },
            status: { $first: '$status' },
            orderNumber: { $first: '$orderNumber' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            orderLines: { $push: '$orderLines' },
            payments: { $push: '$payments' },
          },
        },
        {
          $sort: {
            [sortField]: sortOrder === 'asc' ? 1 : -1,
          },
        },
      ];

      const orders = await this.orderModel.aggregate(pipeline);

      const orderLinePromises = orders.map(async (order) => {
        await Promise.all(
          order.orderLines.map(async (orderLine) => {
            orderLine.product = await this.productModel.findById(
              orderLine.productId,
            );
            orderLine.price = await this.priceModel.findById(orderLine.priceId);
          }),
        );
      });
      await Promise.all(orderLinePromises);

      return orders;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(updatedStatus: UpdateOrderStatusDto): Promise<Order> {
    try {
      let order = await this.orderModel.findById(updatedStatus._id);
      
      order.status = updatedStatus.status;
      return await order.save();
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findWaiting(sortField?: string, sortOrder?: string, amount?: number): Promise<Order[]> {
    const pipeline: any[] = [
      {
        $match: {
          $and: [
            { status: 'waiting' },
            { paymentStatus: 'paid' },
          ],
        },
      },
      {
        $lookup: {
          from: 'orderlines',
          localField: '_id',
          foreignField: 'orderId',
          as: 'orderLines',
        },
      },
      {
        $unwind: {
          path: '$orderLines',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orderLines.productId',
          foreignField: '_id',
          as: 'orderLines.product',
        },
      },
      {
        $unwind: {
          path: '$orderLines.product',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'prices',
          localField: 'orderLines.priceId',
          foreignField: '_id',
          as: 'orderLines.price',
        },
      },
      {
        $unwind: {
          path: '$orderLines.price',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          totalPrice: { $first: '$totalPrice' },
          type: { $first: '$type' },
          status: { $first: '$status' },
          paymentStatus: { $first: '$paymentStatus' },
          orderNumber: { $first: '$orderNumber' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          orderLines: { $push: '$orderLines' },
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === 'asc' ? 1 : -1,
        },
      },
    ];
  
    if (amount !== undefined && amount > 0) {
      pipeline.push({
        $limit: amount,
      });
    }
  
    return this.orderModel.aggregate(pipeline).exec();
  }

  async findInProgress(sortField?: string, sortOrder?: string, amount?: number): Promise<Order[]> {
    const pipeline: any[] = [
      {
        $match: { status: 'in progress' },
      },
      {
        $lookup: {
          from: 'orderlines',
          localField: '_id',
          foreignField: 'orderId',
          as: 'orderLines',
        },
      },
      {
        $unwind: {
          path: '$orderLines',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orderLines.productId',
          foreignField: '_id',
          as: 'orderLines.product',
        },
      },
      {
        $unwind: {
          path: '$orderLines.product',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'prices',
          localField: 'orderLines.priceId',
          foreignField: '_id',
          as: 'orderLines.price',
        },
      },
      {
        $unwind: {
          path: '$orderLines.price',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          totalPrice: { $first: '$totalPrice' },
          type: { $first: '$type' },
          status: { $first: '$status' },
          orderNumber: { $first: '$orderNumber' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          orderLines: { $push: '$orderLines' },
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === 'asc' ? 1 : -1,
        },
      },
    ];
  
    if (amount !== undefined && amount > 0) {
      pipeline.push({
        $limit: amount,
      });
    }
  
    return this.orderModel.aggregate(pipeline).exec();
  }

  async findDone(sortField?: string, sortOrder?: string, amount?: number): Promise<Order[]> {
    const pipeline: any[] = [
      {
        $match: { status: 'done' },
      },
      {
        $lookup: {
          from: 'orderlines',
          localField: '_id',
          foreignField: 'orderId',
          as: 'orderLines',
        },
      },
      {
        $unwind: {
          path: '$orderLines',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orderLines.productId',
          foreignField: '_id',
          as: 'orderLines.product',
        },
      },
      {
        $unwind: {
          path: '$orderLines.product',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'prices',
          localField: 'orderLines.priceId',
          foreignField: '_id',
          as: 'orderLines.price',
        },
      },
      {
        $unwind: {
          path: '$orderLines.price',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          totalPrice: { $first: '$totalPrice' },
          type: { $first: '$type' },
          status: { $first: '$status' },
          orderNumber: { $first: '$orderNumber' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          orderLines: { $push: '$orderLines' },
        },
      },
      {
        $sort: {
          createdAt: -1, 
          [sortField]: sortOrder === 'asc' ? 1 : -1,
        },
      },
    ];
  
    if (amount !== undefined && amount > 0) {
      pipeline.push({
        $limit: amount,
      });
    }
  
    return this.orderModel.aggregate(pipeline).exec();
  }

  async findOrder(id: string) {
    return await this.orderModel.findById(id)
  }
  
  async deleteOrder(id: string) {
    try {
      const deleteOrder = await this.orderModel.findById(id)
      // this.orderLineService.deleteOrderLinesByOrder(deleteOrder._id)
      this.orderLineModel.deleteMany({orderId: deleteOrder._id}).exec()
      await deleteOrder.deleteOne()
      return {
          success: true,
          message: "Order was deleted"
      }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
  }
}
