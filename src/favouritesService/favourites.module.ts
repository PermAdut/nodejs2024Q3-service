import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavController } from './favourites.controller';

@Module({
  imports: [],
  controllers: [FavController],
  providers: [FavouritesService],
})
export class FavouritesModule {}
