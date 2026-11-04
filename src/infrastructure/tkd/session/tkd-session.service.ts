import { Injectable } from '@nestjs/common';

import { HttpService } from '../../../common/http';
import { GuestLoginStrategy } from './strategies/guest-login.strategy';
import { TkdGuestSessionExtractor } from './tkd-guest-session.extractor';
import { TkdSession, WebFormTokens } from './types';
import { TkdQuestionCaptchaService } from '../captcha/question/tkd-question-captcha.service';
import { StudentLoginStrategy } from './strategies/student-login.strategy';
import { WebFormParser } from './webform.parser';

@Injectable()
export class TkdSessionService {
  private readonly LOGIN_URL = 'http://www.tkdbank.org/login.aspx';
  private readonly SEARCH_URL = 'http://www.tkdbank.org/Modifications/Membership/SearchByName.aspx';

  constructor(
    private readonly http: HttpService,
    private readonly guestFactory: TkdGuestSessionExtractor,
    private readonly studentStrategy: StudentLoginStrategy,
    private readonly captchaService: TkdQuestionCaptchaService,
    private readonly guestStrategy: GuestLoginStrategy,
    private readonly parser: WebFormParser,
  ) {}

  async createStudentSession(nationalCode: string): Promise<TkdSession> {
    const response = await this.http.get<string>(this.LOGIN_URL);
    const guestSession = this.guestFactory.extract(response);
    const captcha = this.captchaService.extractAndSolve(response.data);

    await this.studentStrategy.login({ guest: guestSession, nationalCode }, captcha);

    return {
      ...guestSession,
      isAuthenticated: true,
      role: 'student',
    };
  }

  async createSearchSession(cookie: string): Promise<WebFormTokens> {
    const response = await this.http.get<string>(this.SEARCH_URL, {
      headers: { Cookie: cookie },
    });

    const tokens = this.parser.parse(response.data);

    return {
      ...tokens,
    };
  }

  async createGuestSession(): Promise<TkdSession> {
    const response = await this.http.get<string>(this.LOGIN_URL);
    const guestSession = this.guestFactory.extract(response);
    const captcha = this.captchaService.extractAndSolve(response.data);

    await this.guestStrategy.login({ guest: guestSession }, captcha);

    return {
      ...guestSession,
      isAuthenticated: true,
      role: 'guest',
    };
  }
}
