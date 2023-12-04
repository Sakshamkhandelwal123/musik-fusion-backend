import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AfterDestroy,
} from 'sequelize-typescript';

import { deleteEntity } from 'src/utils/constants';
import { getDataCleanupJobId, getQueueValue } from 'src/utils/helpers';

@Table({
  underscored: true,
})
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({ allowNull: false })
  firstName: string;

  @Column({ allowNull: false })
  lastName: string;

  @Column({ allowNull: true })
  profileImage: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false, defaultValue: false })
  isEmailVerified: boolean;

  @Column({ allowNull: true })
  phoneNumber: string;

  @Column({ allowNull: true, unique: true })
  username: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: true })
  emailOtp: number;

  @Column({ allowNull: true })
  spotifyId: string;

  @Column({ allowNull: false })
  @CreatedAt
  createdAt: Date;

  @Column({ allowNull: false })
  @UpdatedAt
  updatedAt: Date;

  @Column({ allowNull: true })
  @DeletedAt
  deletedAt: Date;

  @AfterDestroy
  static async afterDestroyHook(options: any) {
    const dataCleanupQueue = await getQueueValue();

    const jobId = getDataCleanupJobId(deleteEntity.USER, options.id);

    await dataCleanupQueue.add(
      jobId,
      {
        actionName: deleteEntity.USER,
        actionData: options,
      },
      {
        attempts: 3,
        jobId,
        removeOnComplete: true,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }
}
