import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUpdateCredentialsDto } from './aut-update-user-credentials.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUser } from './get-user-decoration';
import { Roles } from './roles/role.decorator';
import { Role } from './roles/role.enum';
import { RolesGuard } from './roles/roles.guard';
import { User } from './schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // GET ALL USERS
  @Get('users')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  // Get user by Id
  @Get('users/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.authService.getUserById(id);
  }

  @Put('users/profile')
  @UseGuards(AuthGuard())
  async updateUser(
    @GetUser() user: User,
    @Body() authUpdateCredentialsDto: AuthUpdateCredentialsDto,
  ): Promise<User> {
    return this.authService.updateUser(authUpdateCredentialsDto, user);
  }

  // DELETE USER
  @Delete('users/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async deletUser(@Param('id') id: string): Promise<User> {
    return this.authService.deleteUser(id);
  }

  // SIGN IN
  @Post('/signin')
  signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(email, password);
  }

  // SIN UP | REGISTER
  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.authService.createUser(authCredentialsDto);
  }
}
