import { IsString, Length, Matches } from 'class-validator';

export class GetStudentByNationalCodeDto {
  @IsString()
  @Length(8, 10, { message: 'National code must be between 8 and 10 characters' })
  @Matches(/^\d+$/, { message: 'National code must contain only digits' })
  nationalCode!: string;
}
