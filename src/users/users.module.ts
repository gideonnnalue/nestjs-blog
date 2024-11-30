import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import profileConfig from './config/profile.config';
import { AuthModule } from '../auth/auth.module';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import jwtConfig from '../auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
    forwardRef(() => AuthModule),

    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersCreateManyProvider,
    CreateUserProvider,
    FindOneUserByEmailProvider,
    FindOneByGoogleIdProvider,
    CreateGoogleUserProvider,
  ],
  exports: [UsersService],
})
export class UsersModule {}
