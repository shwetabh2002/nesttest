import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IEpisode {
  episodeNumber: number;
  seasonNumber: number;
  releaseDate: Date;
  director: string;
  actors: string[];
}
export interface ITvShow {
  _id: string;
  title: string;
  description: string;
  genres: string[];
  episodes: IEpisode[];
}


@Schema()
export class TvShow {
  @Prop({ type: String, required: true, unique: true })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: String }] })
  genres: string[];

  @Prop([
    {
      episodeNumber: { type: Number, required: true },
      seasonNumber: { type: Number, required: true },
      releaseDate: { type: Date, required: true },
      director: { type: String, required: true },
      actors: [{ type: String, required: true }],
    },
  ])
  episodes: IEpisode[];
}

export const TvShowSchema = SchemaFactory.createForClass(TvShow);
