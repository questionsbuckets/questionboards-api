import { Document, Schema, Types } from "mongoose";
import { MongooseId } from "../../utils/commonInterface.utils";

export type TSubTopic = {
    subTopicName: string;
    topicId: MongooseId;
};

export type TSubTopicModel = TSubTopic & Document;

export type TTopic = {
    topicName: string;
    gradeId: MongooseId;
    subject: string;
};

export type TTopicModel = TTopic & Document;
