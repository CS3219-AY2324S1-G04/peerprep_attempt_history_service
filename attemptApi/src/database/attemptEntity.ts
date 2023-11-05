import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({name : 'AttemptEntity'})
export class AttemptEntity {
  
  @PrimaryGeneratedColumn("uuid", { name: 'attempt_id' })
  public attemptId: string;

  @Column({ name: 'user_id', nullable: false  })
  public userId: number;

  @Column({ name: 'question_id', nullable: false  })
  public questionId: string;

  @Column({ name: 'language', nullable: false  })
  public language: string;
  
  @Column({ name: 'code', nullable: false })
  public code: string;

  @Column({ name: 'attempt_date', nullable: false })
  public date: Date;

  public constructor(
    attemptId: string,
    userId: number,
    questionId: string,
    language: string,
    code: string,
  ) {
    this.attemptId = attemptId;
    this.userId = userId;
    this.date = new Date(Date.now());
    this.questionId = questionId;
    this.language = language
    this.code = code;
  }
}