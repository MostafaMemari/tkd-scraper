import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as cheerio from 'cheerio';
import questions from '../../../../data/questions.json';
import { CaptchaQuestion, CaptchaResult, ExtractCaptcha } from './types';

@Injectable()
export class TkdQuestionCaptchaService {
  private readonly captchaQuestions = questions as CaptchaQuestion[];

  extractAndSolve(html: string): ExtractCaptcha {
    const result = this.extract(html);
    const answer = this.solve(result.selectedOption);

    return { result, answer };
  }

  private extract(html: string): CaptchaResult {
    const $ = cheerio.load(html);

    const selected = $('#MembersCaptchaQuestions option[selected]');
    if (selected.length > 0) {
      const value = selected.val();
      const question = selected.text().trim();

      if (typeof value === 'string') {
        return { selectedOption: value, question };
      }
    }

    const fallback = $('#MembersCaptchaQuestions option').not(':first-child').first();

    const value = fallback.val();
    const question = fallback.text().trim();

    if (typeof value !== 'string') {
      throw new InternalServerErrorException('Captcha option not found');
    }

    return { selectedOption: value, question };
  }

  private solve(selectedOption: string): string {
    const found = this.captchaQuestions.find((q) => q.value === selectedOption);

    if (!found) {
      throw new InternalServerErrorException(`Captcha answer not found for option: ${selectedOption}`);
    }

    return found.answer;
  }
}
