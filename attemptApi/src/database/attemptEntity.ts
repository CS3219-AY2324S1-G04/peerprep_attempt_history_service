import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, CreateDateColumn, Index, UpdateDateColumn, Generated } from 'typeorm';

@Entity({name : 'AttemptEntity'})
export class AttemptEntity {
  
  @Column({ name: 'attempt_id' })
  @Generated("uuid")
  public attemptId?: string;

  @PrimaryColumn({ name: 'user_id', primary: true  })
  public userId?: number;

  @PrimaryColumn({ name: 'room_id', primary: true  })
  public roomId?: string;

  @Column({ name: 'question_id', nullable: false  })
  public questionId?: string;


  @Column({ name: 'language', nullable: false  })
  public language?: string;
  
  @Column({ name: 'code', nullable: false })
  public code?: string;

  @UpdateDateColumn({ name: 'attempt_date', nullable: false })
  @Index()
  public date?: Date;

  // public constructor(
  //   userId: number,
  //   questionId: string,
  //   language: string,
  //   code: string,
  // ) {
  //   this.userId = userId;
  //   this.date = new Date(Date.now());
  //   this.questionId = questionId;
  //   this.language = language
  //   this.code = code;
  // }
}