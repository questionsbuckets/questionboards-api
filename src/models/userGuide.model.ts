import { Schema, model, type Document, type SchemaTimestampsConfig } from "mongoose";

export interface IUserGuide extends Document {
    title: string;
    description: string;
    image: string;
    file: string;
}

export type TUserGuideModel = IUserGuide & Document & SchemaTimestampsConfig;

const userGuideSchema = new Schema<IUserGuide>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        file: { type: String, required: true },
    },
    { timestamps: true }
);

const UserGuide = model<IUserGuide>("UserGuide", userGuideSchema);

export default UserGuide;
