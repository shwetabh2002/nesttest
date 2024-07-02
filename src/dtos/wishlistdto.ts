import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateWishlistDto {

    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsString()
    @IsNotEmpty()
    contentType: string;

    @IsNotEmpty()
    @IsString()
    contentTitle: string;

}
