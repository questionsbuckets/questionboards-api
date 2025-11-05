import { Schema, model, type Document, type SchemaTimestampsConfig, Types } from "mongoose";

export interface IFlashcard extends Document {
    title: string;
    description: string;
    previewImage: string;
    file: string;
    grade: Types.ObjectId;
    subject: string;
    topic: Types.ObjectId;
    subTopic: Types.ObjectId;
}

export type TFlashcardModel = IFlashcard & Document & SchemaTimestampsConfig;

const flashcardSchema = new Schema<IFlashcard>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        previewImage: { type: String, required: true },
        file: { type: String, required: true },
        grade: { type: Schema.Types.ObjectId, ref: "Grade", required: true },
        subject: { type: String, required: true },
        topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
        subTopic: { type: Schema.Types.ObjectId, ref: "SubTopic", required: true },
    },
    { timestamps: true }
);

const Flashcard = model<IFlashcard>("Flashcard", flashcardSchema);

export default Flashcard;
