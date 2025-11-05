
import { Document, model, Schema } from 'mongoose';

export interface IResource extends Document {
  image: string;
  title: string;
  description: string;
  file: string;
}

const resourceSchema = new Schema<IResource>(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Resource = model<IResource>('Resource', resourceSchema);
