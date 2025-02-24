import { MyListService } from '../services/myListService';
import { Controller, Get, Post, Delete, Body, Query, NotFoundException, ValidationPipe, UsePipes} from '@nestjs/common';
import { IWishlist, IWishlistItem } from '../models/wishList';
import { CreateWishlistDto } from '../dtos/wishlistdto';


@Controller('mylist')
export class MyListController {
  constructor(
    private myListService: MyListService
  ) {}

 
  @Post('add')
  @UsePipes(new ValidationPipe())
  async addingMyList(
    @Query('userId') userId: string,
    @Body() listItem: CreateWishlistDto,
  ): Promise<string> {
    try {
     await this.myListService.addToMyList(userId, listItem);
     return 'Item added to wishlist';
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('remove')
  async removingMyList(
    @Body('userId') userId : string,
    @Body('itemId') itemId: string
  ): Promise<IWishlist> {
    try {
      const removedWishlist =  await this.myListService.removeFromMyList(userId, itemId);
      return removedWishlist
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('list')
  async myListItems(
    @Query('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<IWishlist | string> {
    try {
      const wishlist = await this.myListService.listMyItems(userId, page, limit);
      return wishlist;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

}