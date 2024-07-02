import {  Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyListController } from './controllers/myListController';
import { MyListService } from './services/myListService';
import { ConfigModule } from '@nestjs/config';
import {UserSchema } from './models/user';
import { MovieSchema } from './models/movie';
import { TvShowSchema } from './models/tvShow';
import { WishlistSchema } from './models/wishList';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      {name: 'User', schema: UserSchema},
      {name: 'Movie', schema: MovieSchema},
      {name: 'TvShow', schema: TvShowSchema},
      {name: 'Wishlist', schema: WishlistSchema}])
  ],
  controllers: [MyListController],      
  providers: [MyListService,MyListController],
  exports: [MyListService, MyListController, MongooseModule, ConfigModule],
})
export class AppModule {}
