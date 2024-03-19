import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { User } from "./user.entity";
import * as Validator from "class-validator";

@Index("fk_post_user_id", ["userId"], {})
@Entity("post")
export class PosT {
  @PrimaryGeneratedColumn({ type: "int", name: "post_id", unsigned: true })
  postId: number;

  @Column({ type: "text", nullable: true })

  @Validator.Length(1, 500)
  content: string | null;

  @Column({ type: "varchar", nullable: true, length: 255 })
  photo: string | null;

  @Column({ type: "timestamp",  name: "created_at", default: () => "'now()'" })
  createdAt: Date;

  @Column({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
