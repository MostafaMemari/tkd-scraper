import { Module } from '@nestjs/common';

import { TkdSessionService } from './session/tkd-session.service';
import { TkdPageService } from './pages/tkd-page.service';
import { TkdScraperService } from './scraper/tkd-scraper.service';
import { TkdQuestionCaptchaService } from './captcha/question/tkd-question-captcha.service';
import { TkdStudentGateway } from './tkd-student.gateway';
import { RetryService } from '../../common/retry';
import { HttpService } from '../../common/http';
import { WebFormParser } from './session/webform.parser';
import { StudentLoginStrategy } from './session/strategies/student-login.strategy';
import { GuestLoginStrategy } from './session/strategies/guest-login.strategy';
import { TkdGuestSessionExtractor } from './session/tkd-guest-session.extractor';
import { TkdGuestGateway } from './tkd-guest.gateway';
import { TkdStudentSearchService } from './search/tkd-student-search.service';
import { TkdImageCaptchaService } from './captcha/image/tkd-image-captcha.service';

@Module({
  providers: [
    HttpService,
    RetryService,
    TkdSessionService,
    TkdPageService,
    TkdScraperService,
    StudentLoginStrategy,
    GuestLoginStrategy,

    TkdImageCaptchaService,
    TkdQuestionCaptchaService,

    WebFormParser,
    TkdStudentGateway,
    TkdGuestGateway,
    TkdGuestSessionExtractor,
    TkdStudentSearchService,
  ],
  exports: [TkdStudentGateway, TkdGuestGateway],
})
export class TkdModule {}
