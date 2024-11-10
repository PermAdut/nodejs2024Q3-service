import { Module } from '@nestjs/common';
import { FavController } from './favourites.comtroller';
import { FavouritesService } from './favourites.service';

@Module({
  imports: [],
  controllers: [FavController],
  providers: [FavouritesService],
})
export class FavouritesModule {}
