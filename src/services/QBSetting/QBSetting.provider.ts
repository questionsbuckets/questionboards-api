import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import QBSetting from "../../models/QBSetting.model.js";
import { addQBSettingType, updateQBSettingType } from "./QBSetting.validate.js";
import { Types } from "mongoose";
import { upload } from "../../utils/cloudinary.utils.js";

export const addQuestionSetting = async (payload: addQBSettingType) => {
  try {
    const { completionMessages, music, background, signature, star } = payload;

    // Upload all files in parallel
    const [
      hundredMusic,
      eightyPlusMusic,
      sixtyPlusMusic,
      belowSixtyMusic,
      uploadedBackground,
      uploadedSignature,
    ] = await Promise.all([
      upload(music.hundred),
      upload(music.eightyPlus),
      upload(music.sixtyPlus),
      upload(music.belowSixty),
      upload(background),
      upload(signature),
    ]);

    await QBSetting.create({
      completionMessages: {
        hundred: completionMessages.hundred,
        eightyPlus: completionMessages.eightyPlus,
        sixtyPlus: completionMessages.sixtyPlus,
        belowSixty: completionMessages.belowSixty,
      },
      music: {
        hundred: hundredMusic.uploadedImageUrl,
        eightyPlus: eightyPlusMusic.uploadedImageUrl,
        sixtyPlus: sixtyPlusMusic.uploadedImageUrl,
        belowSixty: belowSixtyMusic.uploadedImageUrl,
      },
      star: {
        hundred: star.hundred,
        eightyPlus: star.eightyPlus,
        sixtyPlus: star.sixtyPlus,
        fortyPlus: star.fortyPlus,
        belowforty: star.belowforty,
      },
      background: uploadedBackground.uploadedImageUrl,
      signature: uploadedSignature.uploadedImageUrl,
    });

    return GenResObj(Code.OK, true, "Question setting added successfully", {});
  } catch (error) {
    console.error("🚀 ~ addQuestionSetting ~ error:", error);
    throw error;
  }
};

export const getQuestionSetting = async () => {
  try {
    const data = await QBSetting.findOne({});
    return GenResObj(Code.OK, true, "Question setting fetched successfully", {
      data,
    });
  } catch (error) {
    console.error("🚀 ~ getQuestionSetting ~ error:", error);
    throw error;
  }
};

export const updateQuestionSetting = async (payload: updateQBSettingType) => {
  try {
    const {
      QBSettingId,
      completionMessages,
      music,
      star,
      background,
      signature,
    } = payload;

    let findQbSetting = await QBSetting.findById(QBSettingId);
    if (!findQbSetting) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Question setting not found",
        {}
      );
    }
    const updateData: any = {};

    if (completionMessages) {
      updateData["completionMessages"] = {
        ...findQbSetting.completionMessages,
        ...(completionMessages.hundred && {
          hundred: completionMessages.hundred,
        }),
        ...(completionMessages.eightyPlus && {
          eightyPlus: completionMessages.eightyPlus,
        }),
        ...(completionMessages.sixtyPlus && {
          sixtyPlus: completionMessages.sixtyPlus,
        }),
        ...(completionMessages.belowSixty && {
          belowSixty: completionMessages.belowSixty,
        }),
      };
    }

    let uploadedMusic: any = {};
    let uploadedBackground: any = null;
    let uploadedSignature: any = null;

    // Gather upload promises
    const uploadPromises: Promise<any>[] = [];

    if (music?.hundred)
      uploadPromises.push(
        upload(music.hundred).then(
          (res) => (uploadedMusic.hundred = res.uploadedImageUrl)
        )
      );
    if (music?.eightyPlus)
      uploadPromises.push(
        upload(music.eightyPlus).then(
          (res) => (uploadedMusic.eightyPlus = res.uploadedImageUrl)
        )
      );
    if (music?.sixtyPlus)
      uploadPromises.push(
        upload(music.sixtyPlus).then(
          (res) => (uploadedMusic.sixtyPlus = res.uploadedImageUrl)
        )
      );
    if (music?.belowSixty)
      uploadPromises.push(
        upload(music.belowSixty).then(
          (res) => (uploadedMusic.belowSixty = res.uploadedImageUrl)
        )
      );

    if (background)
      uploadPromises.push(
        upload(background).then(
          (res) => (uploadedBackground = res.uploadedImageUrl)
        )
      );
    if (signature)
      uploadPromises.push(
        upload(signature).then(
          (res) => (uploadedSignature = res.uploadedImageUrl)
        )
      );

    // Run uploads in parallel
    await Promise.all(uploadPromises);

    if (Object.keys(uploadedMusic).length > 0) {
      updateData["music"] = { ...findQbSetting.music, ...uploadedMusic };
    }

    if (star) {
      updateData["star"] = {
        ...findQbSetting.star,
        ...(star.hundred && { hundred: star.hundred }),
        ...(star.eightyPlus && { eightyPlus: star.eightyPlus }),
        ...(star.sixtyPlus && { sixtyPlus: star.sixtyPlus }),
        ...(star.fortyPlus && { fortyPlus: star.fortyPlus }),
        ...(star.belowforty && { belowforty: star.belowforty }),
      };
    }

    if (uploadedBackground) updateData["background"] = uploadedBackground;
    if (uploadedSignature) updateData["signature"] = uploadedSignature;

    const updatedSetting = await QBSetting.findByIdAndUpdate(
      QBSettingId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedSetting) throw new Error("Setting not found");

    return GenResObj(
      Code.OK,
      true,
      "Question setting updated successfully",
      updatedSetting
    );
  } catch (error) {
    console.error("🚀 ~ updateQuestionSetting ~ error:", error);
    throw error;
  }
};
