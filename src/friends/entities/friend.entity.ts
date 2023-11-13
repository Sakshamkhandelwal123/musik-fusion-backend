import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

export enum FriendRequestStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

@Table({
  underscored: true,
})
export class Friend extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({ allowNull: false })
  userId: string;

  @Column({ allowNull: false })
  followingUserId: string;

  @Column({ allowNull: false, defaultValue: false })
  isFriend: boolean;

  @Column({ allowNull: true })
  friendRequestStatus: FriendRequestStatus;

  @Column({ allowNull: false })
  @CreatedAt
  createdAt: Date;

  @Column({ allowNull: false })
  @UpdatedAt
  updatedAt: Date;

  @Column({ allowNull: true })
  @DeletedAt
  deletedAt: Date;
}
