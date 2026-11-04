import { Injectable, UnauthorizedException } from '@nestjs/common';
import { URLSearchParams } from 'url';

import { LoginContext, TkdLoginStrategy } from './login.strategy';
import { WebFormTokens } from '../types';
import { HttpService } from '../../../../common/http';
import { ExtractCaptcha } from '../../captcha/question/types';

@Injectable()
export class StudentLoginStrategy implements TkdLoginStrategy {
  private readonly LOGIN_URL = 'http://www.tkdbank.org/login.aspx';

  constructor(private readonly http: HttpService) {}

  async login({ guest, nationalCode }: LoginContext, captcha: ExtractCaptcha): Promise<void> {
    if (!nationalCode) throw new Error('nationalCode is required for student login');

    const response = await this.http.post<string>(this.LOGIN_URL, this.buildParams(guest.tokens, nationalCode, captcha).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-MicrosoftAjax': 'Delta=true',
        Referer: this.LOGIN_URL,
        Cookie: guest.cookie,
      },
    });

    if (!response.data.includes('pageRedirect')) {
      throw new UnauthorizedException('Student login failed');
    }
  }

  private buildParams(tokens: WebFormTokens, nationalCode: string, captcha: ExtractCaptcha): URLSearchParams {
    return new URLSearchParams({
      ToolkitScriptManager1: 'UpdatePanel1|btnOK',
      __VIEWSTATE: tokens.viewState,
      __VIEWSTATEGENERATOR: tokens.viewStateGenerator,
      __EVENTVALIDATION: tokens.eventValidation,

      txtNationalCode: nationalCode,
      MembersCaptchaQuestions: captcha.result.selectedOption,
      txtCaptcha: captcha.answer,
      btnOK: 'ادامه',
    });
  }
}
