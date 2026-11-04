import { ExtractCaptcha } from '../../captcha/question/types';
import { GuestSession } from '../types';

export interface LoginContext {
  guest: GuestSession;
  nationalCode?: string;
}

export interface TkdLoginStrategy {
  login(context: LoginContext, captcha: ExtractCaptcha): Promise<void>;
}
