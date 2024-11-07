import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import { resMiddlware } from './middleware/resHeaders.middleware';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(resMiddlware).forRoutes('*');
  }
}
