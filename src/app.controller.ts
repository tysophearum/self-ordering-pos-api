import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { existsSync, statSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/static/get/*')
  getCardImage(@Req() req, @Res() res) {
    let filePath: string = req.url.replace('/static', '').replace('/get/', '');
    filePath = filePath.split('%20').join(' ');
    const rootPath = '.';

    const file = `${rootPath}/${filePath}`;

    if (existsSync(file) && statSync(file).isFile()) {
      return res.sendFile(file, { root: './' });
    } else {
      return res
        .status(404).json({msg:"File not found"})
    }
  }
}
