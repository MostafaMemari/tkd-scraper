export interface CaptchaQuestion {
  value: string;
  question: string;
  answer: string;
}

export interface CaptchaResult {
  selectedOption: string;
  question: string;
}

export interface ExtractCaptcha {
  result: CaptchaResult;
  answer: string;
}
