import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUser } from '../models/user';
import { Movie, IMovie } from '../models/movie';
import { Wishlist, IWishlistItem, IWishlist } from '../models/wishList';
import { TvShow, ITvShow } from '../models/tvShow';
import { CreateWishlistDto } from 'src/dtos/wishlistdto';

@Injectable()
export class MyListService {
  constructor(
    @InjectModel(User.name) private userModel: Model<IUser>,
    @InjectModel(Movie.name) private movieModel: Model<IMovie>,
    @InjectModel(Wishlist.name) private wishlistModel: Model<IWishlist>,
    @InjectModel(TvShow.name) private tvShowModel: Model<ITvShow>,
  ) {}

  async addToMyList(userId: string, listItem: CreateWishlistDto): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
     await this.wishlistModel.updateOne(
      {
        userId: userId,
        'items._id': { $ne: listItem._id }
      },
      {
        $addToSet: { items: listItem }
      },
      { upsert: true }
    );
  }

  async removeFromMyList(userId: string, itemId: string): Promise<Wishlist | null> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedWishlist = await this.wishlistModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );
    return updatedWishlist;
  }

  async listMyItems(userId: string, page: number, limit: number): Promise<IWishlist | string> {
    const skip = (page - 1) * limit;

    const wishlist = await this.wishlistModel.findOne({ userId: userId })
      .select({ items: { $slice: [skip, limit] } });

    if (!wishlist || wishlist.items.length === 0) {
      return 'You have not added anything in your wishlist';
    }

    return wishlist;
  }


}
