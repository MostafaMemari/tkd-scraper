export interface StudentSearchParams {
  nationalCode: string;
  size: number;
  gender: 'male' | 'female';
  memberType: 'student' | 'coach';
}

export interface StudentSearchContext {
  cookie: string;

  firstName?: string;
  lastName?: string;
  birthDate?: string; // 1394/11/10
  province?: string; // -1 یا 30
  gender?: '1' | '2'; // 1=آقا | 2=خانم
  memberType?: '0' | '1' | '2' | '3' | '4' | '5';
}
