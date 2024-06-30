import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IMovie {
    _id: string;
    title: string;
    description: string;
    genres: string[];
    releaseDate: Date;
    director: string;
    actors: string[];
  }

@Schema()
export class Movie {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: String }] })
  genres: string[];

  @Prop()
  releaseDate: Date;

  @Prop()
  director: string;

  @Prop([String])
  actors: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
