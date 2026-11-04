import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpResult } from '../../../common/http';
import { WebFormParser } from './webform.parser';
import { GuestSession } from './types';

@Injectable()
export class TkdGuestSessionExtractor {
  constructor(private readonly parser: WebFormParser) {}

  extract(response: HttpResult<string>): GuestSession {
    return {
      cookie: this.extractSessionCookie(response.headers['set-cookie'] as string[]),
      tokens: this.parser.parse(response.data),
      createdAt: new Date(),
    };
  }

  private extractSessionCookie(cookies?: string[]): string {
    if (!cookies?.length) {
      throw new UnauthorizedException('No cookies returned from server');
    }

    const session = cookies.find((c) => c.toLowerCase().startsWith('asp.net_sessionid'));

    if (!session) {
      throw new UnauthorizedException('ASP.NET session cookie not found');
    }

    return session.split(';')[0];
  }
}
