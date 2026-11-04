import { Injectable } from '@nestjs/common';
import { HttpService } from '../../../common/http';
import { PageFetcher } from './types';

@Injectable()
export class TkdPageService implements PageFetcher {
  private readonly DASHBOARD_URL = 'http://www.tkdbank.org/main/innermain/default.aspx';
  private readonly PROFILE_URL = 'http://www.tkdbank.org/main/profile.aspx';
  private readonly MEMBERS_INFO_URL = 'http://www.tkdbank.org/Reports/General/MembersInfo.aspx';

  constructor(private readonly http: HttpService) {}

  async fetchDashboard(cookie: string): Promise<string> {
    const res = await this.http.get<string>(this.DASHBOARD_URL, {
      headers: { Cookie: cookie },
    });
    return res.data;
  }

  async fetchProfile(cookie: string): Promise<string> {
    const res = await this.http.get<string>(this.PROFILE_URL, {
      headers: { Cookie: cookie },
    });
    return res.data;
  }

  async fetchMembersInfo(cookie: string): Promise<string> {
    const res = await this.http.get<string>(this.MEMBERS_INFO_URL, {
      headers: { Cookie: cookie, Referer: this.DASHBOARD_URL },
    });

    return res.data;
  }
}
