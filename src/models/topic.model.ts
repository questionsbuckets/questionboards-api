import mongoose, { Document, Schema } from "mongoose";
import { TTopic, TTopicModel } from "../services/admin/admin.interface";

const topicSchema = new Schema<TTopicModel>(
  {
    topicName: {
      type: String,
      required: true,
    },
    gradeId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
  },
  { strict: true, timestamps: true }
);

const topic = mongoose.model<TTopicModel>("topic", topicSchema);

export default topic;
