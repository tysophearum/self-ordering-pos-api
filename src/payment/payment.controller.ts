import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Res,
  Req,
  RawBodyRequest,
  Get,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/createPayment.dto';
import Stripe from 'stripe';
import { Request } from 'express';
import { OrderGateway } from 'src/order/order.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/order/schema/order.schema';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService, private orderGateway: OrderGateway, @InjectModel(Order.name) private orderModel,) {}

  @Post('create')
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<any> {
    try {
      const session = await this.paymentService.createPayment(
        createPaymentDto,
      );
      return session;
    } catch (error) {
      console.error('Payment Error:', error);
      throw new NotFoundException(`Payment failed: ${error.message}`);
    }
  }

  @Post('refund')
  async createPaymentRefund(
    @Body('orderId') orderId: string, 
    @Body('amount') amount: number,
    ): Promise<any> {
    try {
      const refund = await this.paymentService.paymentRefund(orderId, amount);
      return refund;
    } catch (error) {
      throw new NotFoundException(`Payment failed: ${error.message}`);
    }
  }

  @Post('webhook')
  async handlePaymentSuccess(
    @Res() res,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<any> {
    const rawBody = req.rawBody;

    const stripe = new Stripe(
      'sk_test_51NndwhGMYeKzAkCMUW4LtN3Q88KUrSaJIp7VNk3cs8Zb1whCHWxL6xYOeBBldRKmd89G4SsSuTM9OkCKJF0yM2Rq00uJprY441',
      { apiVersion: '2023-08-16' },
    );


    const endpointSecret = 'whsec_4Zy82bc32RzNub9Q0cHOms59nZIU6mkV';


    const sig = req.headers['stripe-signature'];

    let event: any;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'payment_intent.payment_failed':
        this.paymentService.updateOrderPaymentFailStatus(
          event.data.object,
        );
        break;
      case 'checkout.session.completed':
        this.paymentService.updateOrderPaymentSuccessStatus(
          event.data.object,
        );
        break;
      case 'payment_intent.succeeded':
        this.paymentService.updateOrderPaymentSuccessStatus(
          event.data.object,
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  @Get('success')
  async sucessPayment(
    @Query('orderId') orderId: string,
    @Res() response: Response
  ) {
    let order = await this.orderModel.findById(orderId)
    order.paymentStatus = 'paid'
    await order.save()
    this.orderGateway.handleNewOrder()
    response.sendFile('paymentSuccess.html', { root: './src' });
  }
}
