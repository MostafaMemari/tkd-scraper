import { Injectable } from '@nestjs/common';
import { URLSearchParams } from 'url';

import { LoginContext, TkdLoginStrategy } from './login.strategy';
import { WebFormTokens } from '../types';
import { HttpService } from '../../../../common/http';
import { ExtractCaptcha } from '../../captcha/question/types';

@Injectable()
export class GuestLoginStrategy implements TkdLoginStrategy {
  private readonly LOGIN_URL = 'http://www.tkdbank.org/login.aspx';

  constructor(private readonly http: HttpService) {}

  async login({ guest }: LoginContext, captcha: ExtractCaptcha): Promise<void> {
    await this.http.post<string>(this.LOGIN_URL, this.buildParams(guest.tokens, captcha).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-MicrosoftAjax': 'Delta=true',
        Referer: this.LOGIN_URL,
        Cookie: guest.cookie,
      },
    });
  }

  private buildParams(tokens: WebFormTokens, captcha: ExtractCaptcha): URLSearchParams {
    return new URLSearchParams({
      ToolkitScriptManager1: 'UpdatePanel1|btnOK',
      __VIEWSTATE: tokens.viewState,
      __VIEWSTATEGENERATOR: tokens.viewStateGenerator,
      __EVENTVALIDATION: tokens.eventValidation,

      NewMembersCaptchaQuestions: captcha.result.selectedOption,
      TextBox2: captcha.answer,
      btnNew: 'ادامه',
    });
  }
}
