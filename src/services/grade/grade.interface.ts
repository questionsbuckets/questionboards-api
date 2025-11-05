import { SchemaTimestampsConfig } from "mongoose";

export type TGrade = {
  name: string;
  subjects: string[];
};

export type TGradeModel = TGrade & Document & SchemaTimestampsConfig;
