import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyListController } from '../src/controllers/myListController';
import { MyListService } from '../src/services/myListService';
import { ConfigModule } from '@nestjs/config';
import { UserSchema } from '../src/models/user';
import { MovieSchema } from '../src/models/movie';
import { TvShowSchema } from '../src/models/tvShow';
import { WishlistSchema } from '../src/models/wishList';
import { insertData } from '../src/services/sampleDataInsertion';
import { AppModule } from '../src/app.module';

@Module({
    imports: [AppModule],
    providers: [insertData],
})
export class testModule {}
