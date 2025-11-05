import mongoose, { Document, Schema } from "mongoose";
import { TQBSettingModel } from "../services/QBSetting/QBSetting.interface";

const qbSettingSchema = new Schema<TQBSettingModel>(
  {
    completionMessages: {
      hundred: { type: String, required: true },
      eightyPlus: { type: String, required: true },
      sixtyPlus: { type: String, required: true },
      belowSixty: { type: String, required: true },
    },
    music: {
      hundred: { type: String, required: true },
      eightyPlus: { type: String, required: true },
      sixtyPlus: { type: String, required: true },
      belowSixty: { type: String, required: true },
    },
    star: {
      hundred: { type: Number, required: true },
      eightyPlus: { type: Number, required: true },
      sixtyPlus: { type: Number, required: true },
      fortyPlus: { type: Number, required: true },
      belowforty: { type: Number, required: true },
    },
    background: { type: String, required: true },
    signature: { type: String, required: true },
  },
  { timestamps: true }
);

const QBSetting = mongoose.model<TQBSettingModel>("QBSetting", qbSettingSchema);

export default QBSetting;
