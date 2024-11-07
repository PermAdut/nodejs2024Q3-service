import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import { resMiddlware } from './middleware/resHeaders.middleware';
import { TrackController } from './controllers/track.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController, TrackController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(resMiddlware).forRoutes('*');
  }
}
