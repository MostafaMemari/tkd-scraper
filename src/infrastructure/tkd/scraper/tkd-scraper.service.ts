import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { StudentInfo } from 'src/modules/student/types/student-info';

@Injectable()
export class TkdScraperService {
  extract(html: string): StudentInfo {
    const $ = cheerio.load(html);

    const issueDate = this.text($, 'tr:contains(تاریخ اخذ) td:nth-child(2)');
    const beltRank = this.text($, 'tr:contains(درجه کمربند) td:nth-child(2)');
    const expirationDate = this.text($, 'tr:contains(مهلت اعتبار) td:nth-child(2)');
    const imageUrl = $('td > img').attr('src') ?? '';

    return {
      beltRank,
      expirationDate,
      issueDate,
      image: imageUrl,
    };
  }

  private text($: CheerioAPI, selector: string): string {
    return $(selector).text().trim();
  }
}
