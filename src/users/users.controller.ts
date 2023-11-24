import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { InvalidUserError } from 'src/utils/errors/user';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { ImageNotFoundError } from 'src/utils/errors/common';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async upload(
    @CurrentUser() currentUser: User,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    try {
      if (!image) {
        throw new ImageNotFoundError();
      }

      const user = await this.usersService.findOne({ id: currentUser.id });

      if (!user) {
        throw new InvalidUserError();
      }

      if (user.profileImage) {
        //delete image
        await this.cloudinaryService.deleteImage(user.profileImage);

        await this.usersService.update(
          { profileImage: null },
          { id: currentUser.id },
        );
      }

      //upload image
      const uploadedImage = await this.cloudinaryService.uploadImage(
        'User Profile Image',
        image,
      );

      await this.usersService.update(
        { profileImage: uploadedImage.public_id },
        { id: currentUser.id },
      );

      return uploadedImage.url;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
