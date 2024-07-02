import {  Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyListController } from '../src/controllers/myListController';
import { MyListService } from '../src/services/myListService';
import { ConfigModule } from '@nestjs/config';
import {UserSchema } from '../src/models/user';
import { MovieSchema } from '../src/models/movie';
import { TvShowSchema } from '../src/models/tvShow';
import { WishlistSchema } from '../src/models/wishList';
import { insertData } from '../src/services/sampleDataInsertion';

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
      providers: [MyListService, insertData],
})
export class testModule {}
