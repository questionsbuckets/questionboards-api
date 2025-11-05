import { Schema, model, Document, Types } from "mongoose";

export interface ISample40DayPlan extends Document {
  planName: string;
  planType: "20-a-Day" | "40-a-Day" | "60-a-Day" | "100-a-Day";
  grade: Types.ObjectId;
  subject: string;
  topic: Types.ObjectId;
  subTopic: Types.ObjectId;
  displayImage?: string;
  videoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const sample40DayPlanSchema = new Schema<ISample40DayPlan>(
  {
    planName: {
      type: String,
      required: true,
    },
    planType: {
      type: String,
      enum: ["20-a-Day", "40-a-Day", "60-a-Day", "100-a-Day"],
      required: true,
    },
    grade: {
      type: Schema.Types.ObjectId,
      ref: "Grade",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    subTopic: {
      type: Schema.Types.ObjectId,
      ref: "Subtopic",
      required: true,
    },
    displayImage: String,
    videoURL: String,
  },
  { timestamps: true }
);

const Sample40DayPlan = model<ISample40DayPlan>(
  "Sample40DayPlan",
  sample40DayPlanSchema
);

export default Sample40DayPlan;
