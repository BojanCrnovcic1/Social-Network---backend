import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Comment } from './entities/comment.entity';
import { Follower } from './entities/follower.entity';
import { Like } from './entities/like.entity';
import { PosT } from './entities/post.entity';
import { Stories } from './entities/stories.entity';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from 'config/jwt.secret';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/api/user.controller';
import { UserService } from './services/user/user.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from './auth/jwt.service';
import { AuthGuard } from './auth/auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { AuthMiddleware } from './auth/auth.middleware';
import { PostService } from './services/post/post.service';
import { PostController } from './controllers/api/post.controller';
import { CommentController } from './controllers/api/comment.controller';
import { CommentService } from './services/comment/comment.service';
import { FollowerService } from './services/follower/follower.service';
import { FollowerController } from './controllers/api/follower.controller';
import { UploadController } from './controllers/api/upload.controller';
import { StoriesService } from './services/stories/stories.service';
import { LikeService } from './services/like/like.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Comment,
        Follower,
        Like,
        PosT,
        Stories,
        User,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Comment,
      Follower,
      Like,
      PosT,
      Stories,
      User,
    ]),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {expiresIn: '30m'}
    })
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    PostController,
    CommentController,
    FollowerController,
    UploadController,
  ],
  providers: [
    UserService,
    AuthService,
    JwtService,
    AuthGuard,
    JwtStrategy,
    LocalStrategy,
    PostService,
    CommentService,
    FollowerService,
    StoriesService,
    LikeService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
            .exclude('auth/*')
            .forRoutes('api/*')
  }
}
