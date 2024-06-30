import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUser } from '../models/user';
import { Movie, IMovie } from '../models/movie';
import { Wishlist, IWishlistItem, IWishlist } from '../models/wishList';
import { TvShow, ITvShow } from '../models/tvShow';

@Injectable()
export class MyListService {
  constructor(
    @InjectModel(User.name) private userModel: Model<IUser>,
    @InjectModel(Movie.name) private movieModel: Model<IMovie>,
    @InjectModel(Wishlist.name) private wishlistModel: Model<IWishlist>,
    @InjectModel(TvShow.name) private tvShowModel: Model<ITvShow>,
  ) {}

  async addToMyList(userId: string, listItem: IWishlistItem): Promise<void> {
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

  async onModuleInit() {
    await this.insertSampleData1();
    await this.insertSampleData2();
  }

  async insertSampleData1(): Promise<void> {
    const sampleUsers: IUser[] = [
      { _id: "user1", username: 'shwetabh', preferences: { favoriteGenres: ['Action', 'Comedy'], dislikedGenres: ['Horror'] }, watchHistory: [{ watchedOn: new Date(), rating: 4.5 }, { watchedOn: new Date(), rating: 4.0 }] },
      { _id: "user2", username: 'siddharth', preferences: { favoriteGenres: ['Drama', 'Romance'], dislikedGenres: ['SciFi'] }, watchHistory: [] },
      { _id: "user3", username: 'manish', preferences: { favoriteGenres: ['Action', 'Drama'], dislikedGenres: ['Horror'] }, watchHistory: [{ watchedOn: new Date(), rating: 3.8 }] },
      { _id: "user4", username: 'rohit', preferences: { favoriteGenres: ['Comedy', 'Romance'], dislikedGenres: ['Horror', 'SciFi'] }, watchHistory: [] },
      { _id: "user5", username: 'vivek raj', preferences: { favoriteGenres: ['Comedy', 'Drama'], dislikedGenres: ['Horror'] }, watchHistory: [] },
      { _id: "user6", username: 'kumar abhinav', preferences: { favoriteGenres: ['Romance', 'Drama'], dislikedGenres: ['SciFi'] }, watchHistory: [] },
    ];

    const sampleMovies: IMovie[] = [
      { _id: 'mo1', title: 'Attack part 1', description: 'Arjun Shergill, an Indian Army officer, and his team goes on a mission to capture terrorist Rehman Gul, who attacked an Indian army convoy two days before. After a shootout in Rehman\'s hideout, Arjun arrests Rehman and saves a suicide bomber, who is actually Rehman\'s son Hamid Gul.', genres: ['Action', 'SciFi'], releaseDate: new Date(), director: 'aabas mastan', actors: ['John abraham', 'navin'] },
      { _id: 'mo2', title: 'The Dark Knight', description: 'When the menace known as The Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.', genres: ['Action', 'Crime', 'Drama'], releaseDate: new Date('2008-07-18'), director: 'Christopher Nolan', actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'] },
      { _id: 'mo3', title: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', genres: ['Action', 'Adventure', 'SciFi'], releaseDate: new Date('2010-07-16'), director: 'Christopher Nolan', actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'] },
      { _id: 'mo4', title: 'The Shawshank Redemption', description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', genres: ['Drama'], releaseDate: new Date('1994-09-23'), director: 'Frank Darabont', actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'] },
      { _id: 'mo5', title: 'Pulp Fiction', description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', genres: ['Crime', 'Drama'], releaseDate: new Date('1994-10-14'), director: 'Quentin Tarantino', actors: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'] },
      { _id: 'mo6', title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', genres: ['Adventure', 'Drama', 'SciFi'], releaseDate: new Date('2014-11-07'), director: 'Christopher Nolan', actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'] },
      { _id: 'mo7', title: 'The Matrix', description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', genres: ['Action', 'SciFi'], releaseDate: new Date('1999-03-31'), director: 'The Wachowskis', actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'] },
      { _id: 'mo8', title: 'kis kisko pyaar karu', description: 'A man marries three different women who live in the same building and are unaware that they have the same husband. To make matters worse, all his wives get invited to his fourth wedding.', genres: ['Comedy', 'Drama'], releaseDate: new Date(), director: 'Abbas Mastan', actors: ['Kapil Sharma', 'Varun grover'] },
      { _id: 'mo9', title: 'Forrest Gump', description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal, and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.', genres: ['Drama', 'Romance'], releaseDate: new Date('1994-07-06'), director: 'Robert Zemeckis', actors: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'] },
      { _id: 'mo10', title: 'The Godfather', description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', genres: ['Crime', 'Drama'], releaseDate: new Date('1972-03-24'), director: 'Francis Ford Coppola', actors: ['Marlon Brando', 'Al Pacino', 'James Caan'] },
    ];

    const sampleTVShows: ITvShow[] = [
      {
        _id: 'tv1', title: 'Stranger Things', description: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.', genres: ['Horror', 'Fantasy'],
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, releaseDate: new Date('2016-07-15'), director: 'The Duffer Brothers', actors: ['Millie Bobby Brown', 'Finn Wolfhard'] },
          { episodeNumber: 2, seasonNumber: 1, releaseDate: new Date('2016-07-15'), director: 'The Duffer Brothers', actors: ['Millie Bobby Brown', 'Finn Wolfhard'] },
          { episodeNumber: 1, seasonNumber: 2, releaseDate: new Date('2017-10-27'), director: 'The Duffer Brothers', actors: ['Millie Bobby Brown', 'Finn Wolfhard'] },
          { episodeNumber: 2, seasonNumber: 2, releaseDate: new Date('2017-10-27'), director: 'The Duffer Brothers', actors: ['Millie Bobby Brown', 'Finn Wolfhard'] }
        ]
      },
      {
        _id: 'tv2', title: 'Friends', description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.', genres: ['Comedy', 'Romance'],
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, releaseDate: new Date('1994-09-22'), director: 'James Burrows', actors: ['Jennifer Aniston', 'Courteney Cox'] },
          { episodeNumber: 2, seasonNumber: 1, releaseDate: new Date('1994-09-22'), director: 'James Burrows', actors: ['Jennifer Aniston', 'Courteney Cox'] }
        ]
      },
      {
        _id: 'tv3', title: 'Breaking Bad', description: 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family\'s financial future.', genres: ['Drama', 'Crime'],
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, releaseDate: new Date('2008-01-20'), director: 'Vince Gilligan', actors: ['Bryan Cranston', 'Aaron Paul'] },
          { episodeNumber: 2, seasonNumber: 1, releaseDate: new Date('2008-01-20'), director: 'Vince Gilligan', actors: ['Bryan Cranston', 'Aaron Paul'] }
        ]
      },
      {
        _id: 'tv4', title: 'The Office', description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.', genres: ['Comedy'],
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, releaseDate: new Date('2005-03-24'), director: 'Greg Daniels', actors: ['Steve Carell', 'Rainn Wilson'] },
          { episodeNumber: 2, seasonNumber: 1, releaseDate: new Date('2005-03-24'), director: 'Greg Daniels', actors: ['Steve Carell', 'Rainn Wilson'] }
        ]
      },
      {
        _id: 'tv5', title: 'Game of Thrones', description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.', genres: ['Drama', 'Fantasy'],
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, releaseDate: new Date('2011-04-17'), director: 'David Benioff', actors: ['Emilia Clarke', 'Kit Harington'] },
          { episodeNumber: 2, seasonNumber: 1, releaseDate: new Date('2011-04-17'), director: 'David Benioff', actors: ['Emilia Clarke', 'Kit Harington'] }
        ]
      },
      {
        _id: 'tv6', title: 'The Crown', description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the twentieth century.', genres: ['Drama', 'History'],
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, releaseDate: new Date('2016-11-04'), director: 'Peter Morgan', actors: ['Claire Foy', 'Matt Smith'] },
          { episodeNumber: 2, seasonNumber: 1, releaseDate: new Date('2016-11-04'), director: 'Peter Morgan', actors: ['Claire Foy', 'Matt Smith'] }
        ]
      }
    ];

    try {
      await Promise.all([
        this.userModel.insertMany(sampleUsers),
        this.movieModel.insertMany(sampleMovies),
        this.tvShowModel.insertMany(sampleTVShows),
      ]);
      console.log("sample data1 inserted successfully");
     
    } catch (error) {
      console.log('Error inserting sample data', error.message,error.stack);
    }
  }

  async insertSampleData2(): Promise<void> {
    try {
      const users = await this.userModel.find();

      const sampleWishlists = users.map(user => ({
        userId: user._id.toString(),
        items: [
          {
            _id: 'mo1',
            contentType: 'Movie',
            contentTitle: 'Heaven on Earth',
            addedOn: new Date()
          },
          {
            _id: 'tv1',
            contentType: 'TVShow',
            contentTitle: 'Two and a Half Men',
            addedOn: new Date()
          }
        ]
      }));

      await this.wishlistModel.insertMany(sampleWishlists);

      console.log('Sample data2 inserted successfully');
    } catch (error) {
      console.log('Error inserting sample data2', error.message,error.stack);
    }
  }
}
