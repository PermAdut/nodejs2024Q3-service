import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { resMiddlware } from './middleware/resHeaders.middleware';
import { UserModule } from './userService/user.module';
import { TrackModule } from './trackService/track.module';
import { FavouritesModule } from './favouritesService/favourites.module';
import { AlbumModule } from './albumService/album.module';
import { ArtistModule } from './artistService/artist.module';

@Module({
  imports: [
    UserModule,
    TrackModule,
    FavouritesModule,
    AlbumModule,
    ArtistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(resMiddlware).forRoutes('*');
  }
}
