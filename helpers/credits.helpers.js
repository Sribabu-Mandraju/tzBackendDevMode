import User from "../models/userModel.js";
/**
 * Helper function to update credits for a user.
 * @param {string} tzkid - The Teckzite ID of the user.
 * @param {number} creditCount - The number of credits to increase.
 * @returns {object} Updated user object or error message.
 */
export const updateUserCredits = async (tzkid, creditCount) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { tzkid },
      { $inc: { credits: creditCount } },
      { new: true, upsert: false }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user credits:", error.message);
    throw error;
  }
};
