import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import { resMiddlware } from './middleware/resHeaders.middleware';
import { TrackController } from './controllers/track.controller';
import { ArtistController } from './controllers/artist.controller';
import { AlbumController } from './controllers/album.controller';
import { FavController } from './controllers/favourites.comtroller';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    TrackController,
    ArtistController,
    AlbumController,
    FavController,
  ],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(resMiddlware).forRoutes('*');
  }
}
