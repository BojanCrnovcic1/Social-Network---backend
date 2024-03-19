import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { PosT } from "./post.entity";
import { User } from "./user.entity";

@Index("fk_like_comment_id", ["commentId"], {})
@Index("fk_like_post_id", ["postId"], {})
@Index("fk_like_user_id", ["userId"], {})
@Entity("like")
export class Like {
  @PrimaryGeneratedColumn({ type: "int", name: "like_id", unsigned: true })
  likeId: number;

  @Column({ type: "int",  name: "user_id", unsigned: true })
  userId: number;

  @Column({
    type: "int",
    name: "post_id",
    nullable: true,
    unsigned: true,
  })
  postId: number | null;

  @Column({
    type: "int",
    name: "comment_id",
    nullable: true,
    unsigned: true,
  })
  commentId: number | null;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "comment_id", referencedColumnName: "commentId" }])
  comment: Comment;

  @ManyToOne(() => PosT, (post) => post.likes, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "postId" }])
  post: PosT;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
