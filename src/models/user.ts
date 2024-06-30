import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export interface UserPreferences {
    favoriteGenres: string[];
    dislikedGenres: string[];
  }
  
  export interface WatchHistory {
    watchedOn: Date;
    rating?: number;
  }

  export interface IUser {
    _id: string;
    username: string;
    preferences: UserPreferences;
    watchHistory: WatchHistory[];
  }


@Schema({
    timestamps: true
})
export class User {
     @Prop()
     _id: string;
     
    @Prop({ required: true })
    username: string;
  
    @Prop({ type: { favoriteGenres: [String], dislikedGenres: [String] } })
    preferences: UserPreferences;
  
    @Prop([{ contentId: String, watchedOn: Date, rating: Number }])
    watchHistory: WatchHistory[];
  }
  
  export const UserSchema = SchemaFactory.createForClass(User);