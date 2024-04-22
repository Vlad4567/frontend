import { UserData } from './account';

export interface UserReview
  extends Pick<UserData, 'username' | 'profilePhoto'> {
  id: number;
}

export interface MasterReviewsCard {
  comment: string | null;
  dateTime: string;
  grade: number;
  id: number;
  masterCardId: number;
  user: UserReview;
}
