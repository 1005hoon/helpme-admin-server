import { Request } from 'express';
import { AdminUser } from 'src/admin-users/admin-user.schema';

export interface RequestWithUser extends Request {
  user: AdminUser;
}
