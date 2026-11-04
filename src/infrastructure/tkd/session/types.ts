import { CaptchaResult } from '../captcha/question/types';

export interface WebFormTokens {
  viewState: string;
  eventValidation: string;
  viewStateGenerator: string;
}

export interface RawLoginResponse {
  html: string;
  cookie: string;
}

export interface GuestSession {
  cookie: string;
  tokens: WebFormTokens;
  createdAt?: Date;
}

export interface GuestSessionWithCaptcha extends GuestSession {
  captcha: CaptchaResult;
}

export interface TkdSession extends GuestSession {
  isAuthenticated: boolean;
  nationalCode?: string;
  role: 'guest' | 'student' | 'coach';
}
