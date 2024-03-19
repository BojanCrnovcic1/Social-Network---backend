import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Index("fk_stories_user_id", ["userId"], {})
@Entity("stories")
export class Stories {
  @PrimaryGeneratedColumn({ type: "int", name: "stories_id", unsigned: true })
  storiesId: number;

  @Column({
    type: "varchar", 
    name: "photo_stories",
    length: 255,
  })
  photoStories: string;

  @Column({type: "int", name: "user_id", unsigned: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.stories, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
