/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { createWorker, PSM } from 'tesseract.js';
import Sharp from 'sharp';
import { HttpService } from 'src/common/http';

interface OcrWorker {
  setParameters(params: Record<string, string | number>): Promise<unknown>;
  recognize(image: Buffer): Promise<{
    data: {
      text: string;
    };
  }>;
  terminate(): Promise<void>;
}

@Injectable()
export class TkdImageCaptchaService {
  private worker: OcrWorker | null = null;

  constructor(private readonly http: HttpService) {}

  private async initWorker(): Promise<void> {
    if (!this.worker) {
      const worker = (await createWorker('eng')) as unknown as OcrWorker;

      await worker.setParameters({
        tessedit_char_whitelist: '0123456789',
        tessedit_pageseg_mode: PSM.SINGLE_LINE,
        classify_bln_numeric_mode: '1',
      });

      this.worker = worker;
    }
  }

  async solve(html: string, cookie: string): Promise<string> {
    const url = this.extractImageUrl(html);
    return this.solveFromUrl(url, cookie);
  }

  private extractImageUrl(html: string): string {
    const $ = cheerio.load(html);
    const img = $('img[src*="captcha.aspx"]').first();

    if (!img.length) {
      throw new InternalServerErrorException('Image captcha not found');
    }

    let src = img.attr('src');
    if (!src) {
      throw new InternalServerErrorException('Captcha src empty');
    }

    if (src.startsWith('..')) {
      src = 'http://www.tkdbank.org/' + src.replace(/^..\//, '');
    }

    return src;
  }

  private async solveFromUrl(url: string, cookie: string): Promise<string> {
    await this.initWorker();

    if (!this.worker) {
      throw new InternalServerErrorException('Tesseract worker not initialized');
    }

    const res = await this.http.get<ArrayBuffer>(url, {
      headers: {
        Cookie: cookie,
        Referer: 'http://www.tkdbank.org/',
      },
      responseType: 'arraybuffer',
    });

    if (res.status !== 200) {
      throw new InternalServerErrorException(`Failed to download captcha image: ${res.status}`);
    }

    const buffer: Buffer = Buffer.from(res.data);

    const clean: Buffer = await Sharp(buffer)
      .resize({ width: 400 })
      .grayscale()
      .normalize()
      .threshold(105)
      .median(1)
      .modulate({ brightness: 1.2, saturation: 0 })
      .toBuffer();

    const {
      data: { text },
    } = await this.worker.recognize(clean);

    return text.replace(/\D/g, '').trim();
  }
}
