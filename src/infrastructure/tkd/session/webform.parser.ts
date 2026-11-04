import * as cheerio from 'cheerio';
import { InternalServerErrorException } from '@nestjs/common';
import { WebFormTokens } from './types';

export class WebFormParser {
  parse(html: string): WebFormTokens {
    const $ = cheerio.load(html);

    const viewState = $('#__VIEWSTATE').val();
    const eventValidation = $('#__EVENTVALIDATION').val();
    const viewStateGenerator = $('#__VIEWSTATEGENERATOR').val();

    if (typeof viewState !== 'string' || typeof eventValidation !== 'string' || typeof viewStateGenerator !== 'string') {
      throw new Error('Failed to extract WebForm tokens');
    }

    return {
      viewState,
      eventValidation,
      viewStateGenerator,
    };
  }

  extractUpdatePanelHtml(response: string, panelId = 'UpdatePanel1'): string {
    const marker = `|updatePanel|${panelId}|`;
    const start = response.indexOf(marker);

    if (start === -1) {
      throw new InternalServerErrorException(`UpdatePanel ${panelId} not found`);
    }

    const rest = response.substring(start + marker.length);
    const end = rest.indexOf('|hiddenField|');

    return end === -1 ? rest : rest.substring(0, end);
  }
}
