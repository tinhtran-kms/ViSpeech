import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsInt
} from "class-validator";
import { Transform, Type } from 'class-transformer'
import { Column, Entity } from "typeorm";
import { BaseEntityDto } from "base/base-entity.dto";

export class ReportIdRequestParamsDto {
  constructor(reportId) {
    this.id = reportId;
  }

  @IsString()
  @IsNotEmpty()
  id: string;
}

@Entity("reports")
export class ReportDto extends BaseEntityDto {

  @IsNotEmpty()
  @IsString()
  @Column()
  tokenId: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  userId: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Column({
    name: "used_minutes"
  })
  usedMinutes: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @Column({
    name: "date_report"
  })
  dateReport: Date;
}
