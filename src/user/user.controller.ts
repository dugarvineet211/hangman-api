import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('/login')
  async login(@Body() loginDto: CreateUserDto) {
    try {
      return await this.userService.login(loginDto);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  // @UseGuards(AuthGuard)
  // @Post('/demo')
  // async demo() {
  //   try {
  //     return 'Hello';
  //   } catch (e) {
  //     throw new HttpException(e.message, e.status);
  //   }
  // }
}
