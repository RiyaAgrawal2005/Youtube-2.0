import comment from "../Modals/comment.js";
import mongoose from "mongoose";



// Like a comment
export const likeComment = async (req, res) => {
  const { id } = req.params; // comment id
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Comment not found");
  }

  try {
    const commentDoc = await comment.findById(id);
    if (!commentDoc) return res.status(404).send("Comment not found");

    // Remove dislike if exists
    commentDoc.dislikes = commentDoc.dislikes.filter(
      (uid) => uid.toString() !== userId
    );

    // Toggle like
    if (commentDoc.likes.includes(userId)) {
      commentDoc.likes = commentDoc.likes.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      commentDoc.likes.push(userId);
    }

    await commentDoc.save();
    res.status(200).json(commentDoc);
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Dislike a comment
export const dislikeComment = async (req, res) => {
  const { id } = req.params; // comment id
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Comment not found");
  }

  try {
    const commentDoc = await comment.findById(id);
    if (!commentDoc) return res.status(404).send("Comment not found");

    // Remove like if exists
    commentDoc.likes = commentDoc.likes.filter(
      (uid) => uid.toString() !== userId
    );

    // Toggle dislike
    if (commentDoc.dislikes.includes(userId)) {
      commentDoc.dislikes = commentDoc.dislikes.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      commentDoc.dislikes.push(userId);
    }

   // Auto-delete if dislikes reach 2
    if (commentDoc.dislikes.length >= 2) {
      await comment.findByIdAndDelete(id);
      return res.status(200).json({ message: "Comment deleted due to dislikes" });
    }


    await commentDoc.save();
    res.status(200).json(commentDoc);
  } catch (error) {
    console.error("Error disliking comment:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const postcomment = async (req, res) => {
  console.log("Received comment data:", req.body);
  const commentdata = req.body;
  const postcomment = new comment(commentdata);
  try {
    await postcomment.save();
    return res.status(200).json({ comment: true });
  } catch (error) {
    console.error("Console error:", error.message);
    console.error(error.stack);
    console.log("Comment data causing error:", commentdata);


    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getallcomment = async (req, res) => {
  const { videoid } = req.params;
  try {
    const commentvideo = await comment.find({ videoid: videoid });
    return res.status(200).json(commentvideo);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const deletecomment = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    await comment.findByIdAndDelete(_id);
    return res.status(200).json({ comment: true });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const editcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    const updatecomment = await comment.findByIdAndUpdate(_id, {
      $set: { commentbody: commentbody },
    });
    res.status(200).json(updatecomment);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};