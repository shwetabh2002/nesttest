import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Wishlist } from 'src/models/wishList';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Movie } from 'src/models/movie';
import { User } from 'src/models/user';
console.log("0");
describe('AppController (e2e)', () => {
  // console.log("1");
  let app: INestApplication;
  let wishlistModel: Model<Wishlist>;
  let userModel: Model<User>;
  let movieModel: Model<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();


    app = moduleFixture.createNestApplication();
    await app.init();

    wishlistModel = moduleFixture.get<Model<Wishlist>>(getModelToken('Wishlist'));
    userModel = moduleFixture.get<Model<User>>(getModelToken('User'));
    movieModel = moduleFixture.get<Model<Movie>>(getModelToken('Movie'));
  });

  afterAll(async () => {
    await app.close();
  });

  it('should add an item to the wishlist', async () => {
    const movies = await movieModel.find();
    expect(movies).toBeDefined();
    expect(movies.length).toBeGreaterThan(0);

    const randomMovie = movies[movies.length - 1];

    const response = await request(app.getHttpServer())
      .post('/mylist/add')
      .query({ userId: 'user1' })
      .send({
        _id: randomMovie._id,
        contentType: 'Movie',
        contentTitle: randomMovie.title,
      });

    expect(response.status).toBe(201);

    const wishlist = await wishlistModel.findOne({ userId: 'user1' });
    expect(wishlist).not.toBeNull();
    expect(wishlist!.items).toHaveLength(3);
  });

  it('should remove an item from the wishlist', async () => {
    const wishlist = await wishlistModel.findOne({ userId: 'user4' });
    const itemIdToRemove = wishlist!.items[0]._id;

    const response = await request(app.getHttpServer())
      .delete('/mylist/remove')
      .send({
        userId: 'user4',
        itemId: itemIdToRemove,
      });

    expect(response.status).toBe(200);

    const updatedWishlist = await wishlistModel.findOne({ userId: 'user4' });
    expect(updatedWishlist).not.toBeNull();
    expect(updatedWishlist!.items).toHaveLength(1);
  });

  it('should list items from the wishlist', async () => {
    const response = await request(app.getHttpServer())
      .get('/mylist/list')
      .query({ userId: 'user5' });

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(2);
  });

  it('should handle case where user has not added anything to the wishlist', async () => {
    const response = await request(app.getHttpServer())
      .get('/mylist/list')
      .query({ userId: 'user10' });

    expect(response.status).toBe(200);
    expect(response.text).toBe('You have not added anything in your wishlist');
  });


});
