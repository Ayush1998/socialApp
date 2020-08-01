const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load Post model
const Post = require("../../models/Posts");

//load profile model
const Profile = require("../../models/Profile");

//load validation
const validatePost = require("../../validation/post");

router.get("/test", (req, res) => res.json({ msg: "users works" }));

// @route POST api/posts
// @desc  create post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePost(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route GET api/posts
// @desc  get all posts
// @access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({ noposts: "no posts found" }));
});

// @route GET api/posts/:post_id
// @desc  get single posts
// @access Public
router.get("/:post_id", (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => {
      if (post) {
        return res.json(post);
      }

      res.status(400).json({ nopost: "post doesn't exist" });
    })
    .catch(err => res.status(404).json({ nopost: "post doesn't exist" }));
});

// @route DELETE api/posts/:post_id
// @desc  delete single posts
// @access private
router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        Profile.findOne({ user: req.user.id }).then(profile => {
          // check owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ unauthorized: "user is not authorized" });
          }

          //remove post
          post.remove().then(() => res.json({ success: "true" }));
        });
      })
      .catch(err => res.status(400).json({ nopostfound: "no post found" }));
  }
);

// @route POST api/posts/like/:post_id
// @desc  like post
// @access private
router.post(
  "/like/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.post_id)
        .then(post => {
          //check if user already liked
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "post is already liked by this user" });
          }
          //add like
          post.likes.unshift({ user: req.user.id });

          //save post
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(400).json({ nopostfound: "no post found" }));
    });
  }
);

// @route POST api/posts/unlike/:post_id
// @desc  unlike post
// @access private
router.post(
  "/unlike/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.post_id)
        .then(post => {
          //check if user already liked
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "post is not liked by the user" });
          }
          //get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          //remove that user from likes array
          post.likes.splice(removeIndex, 1);
          //save post
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(400).json({ nopostfound: "no post found" }));
    });
  }
);

// @route POST api/posts/comment/:post_id
// @desc  comment on the post
// @access private
router.post(
  "/comment/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePost(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.post_id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //add comment
        post.comments.unshift(newComment);

        //save post
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ nopostfound: "No Post found" }));
  }
);

// @route DELETE api/posts/comment/:post_id/:comment_id
// @desc  delete comment on the post
// @access private
router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        //check if user already commented
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(400)
            .json({ notcommented: "there is no comment by the user" });
        }
        //get remove index
        const removeIndex = post.comments
          .map(item => item._id)
          .indexOf(req.params.comment_id);
        //remove that user from likes array
        post.comments.splice(removeIndex, 1);
        //save post
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ nopostfound: "No Post found" }));
  }
);
module.exports = router;
