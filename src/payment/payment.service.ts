import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { OrderService } from 'src/order/order.service';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schema/payment.schema';
import { Order } from 'src/order/schema/order.schema';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(
    private orderService: OrderService,
    @InjectModel(Order.name) private orderModel,
    @InjectModel(Payment.name) private paymentModel,
  ) {
    this.stripe = new Stripe(
      'sk_test_51NndwhGMYeKzAkCMUW4LtN3Q88KUrSaJIp7VNk3cs8Zb1whCHWxL6xYOeBBldRKmd89G4SsSuTM9OkCKJF0yM2Rq00uJprY441',
      { apiVersion: '2023-08-16' },
    );
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    try {
      let items = [];
      const order = await this.orderService.findById(createPaymentDto.orderId);
      order[0].orderLines.forEach((orderLine) => {
        let products = orderLine.product.name;

        if (orderLine.additionals) {
          products += ` with ${orderLine.additionals}`;
        }

        items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: products,
              images: [
                'http://137.184.220.73:3001/static/get' +
                  orderLine.product.image.substring(1),
              ],
            },
            unit_amount: Math.ceil(
              ((orderLine.totalPrice / orderLine.quantity) * 100) / 4000,
            ),
          },
          quantity: orderLine.quantity,
        });
      });

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items,
        mode: 'payment',
        payment_intent_data: {
          setup_future_usage: 'on_session',
        },
        success_url: `http://137.184.220.73:3001/payment/success?orderId=${createPaymentDto.orderId}`,
        cancel_url: `http://137.184.220.73:3001/payment/error?orderId=${createPaymentDto.orderId}`,
        metadata: {
          orderId: createPaymentDto.orderId,
        },
      });

        const payment = await this.paymentModel.create({
          orderId: createPaymentDto.orderId,
          payment_status: session.payment_status,
          payment_intent_id: session.payment_intent,
        });
        
      return {
        payment,
        session
      };
    } catch (error) {
      console.error('Stripe Error:', error);
      throw error;
    }
  }

  async paymentRefund(orderId: string, amount: number): Promise<any> {
    try {
      const foundPayment = await this.paymentModel.findOne({ orderId });

      if (foundPayment?.payment_status == 'paid') {
          const refund = await this.stripe.refunds.create({
            payment_intent: foundPayment.payment_intent_id,
            amount: amount * 100,
          })

        return refund;
      } else {
        throw new BadRequestException('This payment is not paid yet.');
      }
    } catch (error) {
      console.error('Stripe Error:', error);
      throw error;
    }
  }

  async StatusSession(sessionId: string): Promise<any> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      const orderId = session.metadata.orderId;

      if (session.payment_status === 'paid') {
        return {
          message: 'Payment succeeded',
          orderId: orderId,
          session,
        };
      } else if (session.payment_status === 'unpaid') {
        return {
          message: 'Payment failed unpaid',
          orderId: orderId,
          session,
        };
      } else {
        return {
          message: 'No payment required',
          orderId: orderId,
          session,
        };
      }
    } catch (error) {
      console.error('Stripe Error: ', error);
      throw error;
    }
  }

  async updateOrderPaymentSuccessStatus(data) {
    try {
      const metaData = data['metadata'];
      const intendId = data['payment_intent'];
      const orderId = metaData.orderId;

      const payment = await this.paymentModel.findOneAndUpdate(
        { orderId: orderId },
        { payment_status: 'paid', payment_intent_id: intendId },
        { new: true },
      );

      return payment;
    } catch (error) {
      console.log({ error });
    }
  }

  async updateOrderPaymentFailStatus(data) {
    const metaData = data['metadata'];
    const orderId = metaData.orderId;

    const payment = await this.paymentModel.findOneAndUpdate(
      { orderId: orderId },
      { payment_status: 'unpaid' },
      { new: true },
    );

    return payment;
  }
}
