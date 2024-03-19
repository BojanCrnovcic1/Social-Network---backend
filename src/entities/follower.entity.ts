import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Index("uq_follower_user_id", ["userId"], { unique: true })
@Index("uq_follower_follower_user_id", ["followerUserId"], { unique: true })
@Index("IDX_6a78a9c6f866dcc0b9195a5420", ["userId"], { unique: true })
@Index("IDX_8b4e73487460a1574190a28d0e", ["followerUserId"], { unique: true })
@Entity("follower")
export class Follower {
  @PrimaryGeneratedColumn({ type: "int", name: "follower_id", unsigned: true })
  followerId: number;

  @Column("int", { name: "user_id", unique: true, unsigned: true })
  userId: number;

  @Column("int", { name: "follower_user_id", unique: true, unsigned: true })
  followerUserId: number;

  @OneToOne(() => User, (user) => user.follower, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToOne(() => User, (user) => user.follower2, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "follower_user_id", referencedColumnName: "userId" }])
  followerUser: User;
}
