import { Injectable } from '@nestjs/common';
import { URLSearchParams } from 'url';

import type { WebFormTokens } from '../session/types';
import { StudentSearchContext } from './types';
import { WebFormParser } from '../session/webform.parser';
import { HttpService } from 'src/common/http';

@Injectable()
export class TkdStudentSearchService {
  private readonly SEARCH_URL = 'http://www.tkdbank.org/Modifications/Membership/SearchByName.aspx';

  constructor(
    private readonly http: HttpService,
    private readonly parser: WebFormParser,
  ) {}

  async search(context: StudentSearchContext): Promise<string> {
    const { cookie } = context;

    const response = await this.http.get<string>(this.SEARCH_URL, { headers: { Cookie: cookie } });

    const tokens = this.parser.parse(response.data);

    const body = this.buildParams(tokens, context).toString();

    const res = await this.http.post<string>(this.SEARCH_URL, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: this.SEARCH_URL,
        Cookie: cookie,
      },
    });

    return res.data;
  }

  private buildParams(tokens: WebFormTokens, ctx: StudentSearchContext): URLSearchParams {
    const gender = ctx.gender ?? '2';
    const memberType = ctx.memberType ?? '2';

    const genderRadio = gender === '1' ? 'RadioButton1' : 'RadioButton2';

    const memberTypeRadioMap = {
      '0': 'RadioButton8',
      '1': 'RadioButton4',
      '2': 'RadioButton3',
      '3': 'RadioButton5',
      '4': 'RadioButton6',
      '5': 'RadioButton7',
    };

    return new URLSearchParams({
      __EVENTTARGET: '',
      __EVENTARGUMENT: '',
      __LASTFOCUS: '',

      __VIEWSTATE: tokens.viewState,
      __VIEWSTATEGENERATOR: tokens.viewStateGenerator,
      __VIEWSTATEENCRYPTED: '',
      __EVENTVALIDATION: tokens.eventValidation,

      ctl00$ContentPlaceHolder1$TextBox1: ctx.firstName ?? '',
      ctl00$ContentPlaceHolder1$TextBox2: ctx.lastName ?? '',
      ctl00$ContentPlaceHolder1$TextBox6: ctx.birthDate ?? '',

      ctl00$ContentPlaceHolder1$hdnTxtGender: gender,
      ctl00$ContentPlaceHolder1$hdnTxtMemberType: memberType,

      ctl00$ContentPlaceHolder1$DropDownList1: ctx.province ?? '-1',

      ctl00$ContentPlaceHolder1$Gender: genderRadio,
      ctl00$ContentPlaceHolder1$MemberType: memberTypeRadioMap[memberType],

      ctl00$ContentPlaceHolder1$btnSearch: 'جستجو',
    });
  }
}
