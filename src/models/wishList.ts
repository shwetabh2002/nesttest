import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IWishlistItem {
  _id: string;
  contentType: string;
  contentTitle: string;
  addedOn: Date;
}
export interface IWishlist {
  _id: string;
  userId: string;
  items: IWishlistItem[];
}

@Schema()
export class Wishlist {
  @Prop()
  _id: string;
  
  @Prop({ type: String, required: true, unique: true })
  userId: string;

  @Prop([
    {
      _id: { type: String },
      contentType: { type: String, required: true },
      contentTitle: { type: String, required: true },
      addedOn: { type: Date, default: Date.now },
    },
  ])
  items: IWishlistItem[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
