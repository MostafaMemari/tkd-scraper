import { Injectable } from '@nestjs/common';
import { StudentGateway } from '../../modules/student/ports/student.gateway';
import { TkdSessionService } from './session/tkd-session.service';
import { TkdScraperService } from './scraper/tkd-scraper.service';
import { StudentInfo } from '../../modules/student/types/student-info';
import { TkdPageService } from './pages/tkd-page.service';
import { TkdImageCaptchaService } from './captcha/image/tkd-image-captcha.service';

@Injectable()
export class TkdStudentGateway implements StudentGateway {
  constructor(
    private readonly session: TkdSessionService,
    private readonly pages: TkdPageService,
    private readonly scraper: TkdScraperService,
    private readonly imageCaptcha: TkdImageCaptchaService,
  ) {}

  async getByNationalCode(nationalCode: string): Promise<any> {
    const { cookie } = await this.session.createStudentSession(nationalCode);

    // const html = await this.pages.fetchDashboard(cookie);
    // return this.scraper.extract(html);

    const html = await this.pages.fetchMembersInfo(cookie);
    const result = await this.imageCaptcha.solve(html, cookie);

    console.log(result);

    return html;
  }
}
