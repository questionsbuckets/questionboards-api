import mongoose, { Document, Schema } from "mongoose";
import { TSubTopicModel } from "../services/admin/admin.interface";

const subTopicSchema = new Schema<TSubTopicModel>(
  {
    subTopicName: {
      type: String,
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { strict: true, timestamps: true }
);

const Subtopic = mongoose.model<TSubTopicModel>("subtopic", subTopicSchema);

export default Subtopic;
