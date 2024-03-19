import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Follower } from "./follower.entity";
import { Like } from "./like.entity";
import { PosT } from "./post.entity";
import { Stories } from "./stories.entity";
import * as Validator from "class-validator";

@Index("uq_user_email", ["email"], { unique: true })
@Index("IDX_e12875dfb3b1d92d7d7c5377e2", ["email"], { unique: true })
@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column({type: "varchar", unique: true, length: 125 })
  @Validator.IsNotEmpty()
  @Validator.IsEmail({
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    require_tld: true
  })
  email: string;

  @Column({type: "varchar",  name: "password_hash", length: 225 })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;

  @Column({type: "varchar", length: 225 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3, 255)
  username: string;

  @Column({type: "text", nullable: true })
  @Validator.IsString()
  @Validator.Length(50, 1500)
  bio: string | null;

  @Column({type: "varchar",  name: "profile_photo", nullable: true, length: 225 })
  profilePhoto: string | null;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToOne(() => Follower, (follower) => follower.user)
  follower: Follower;

  @OneToOne(() => Follower, (follower) => follower.followerUser)
  follower2: Follower;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => PosT, (post) => post.user)
  posts: PosT[];

  @OneToMany(() => Stories, (stories) => stories.user)
  stories: Stories[];
}
