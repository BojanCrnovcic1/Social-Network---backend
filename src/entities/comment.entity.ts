import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PosT } from "./post.entity";
import { User } from "./user.entity";
import { Like } from "./like.entity";
import * as Validator from "class-validator";

@Index("fk_comment_post_id", ["postId"], {})
@Index("fk_comment_user_id", ["userId"], {})
@Entity("comment")
export class Comment {
  @PrimaryGeneratedColumn({ type: "int", name: "comment_id", unsigned: true })
  commentId: number;

  @Column({type: "text" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1, 500)
  content: string;

  @Column({type: "timestamp", name: "created_at", default: () => "'now()'" })
  createdAt: Date;

  @Column({type: "int",  name: "user_id", unsigned: true })
  userId: number;

  @Column({type: "int",  name: "post_id", unsigned: true })
  postId: number;

  @ManyToOne(() => PosT, (post) => post.comments, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "postId" }])
  post: PosT;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];
}
