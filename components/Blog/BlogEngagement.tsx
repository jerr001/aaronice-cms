/**
 * Blog Post Engagement Section
 * Comments and likes for blog posts
 */

"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BlogComment } from "@/types/blog-engagement";

interface BlogEngagementProps {
  slug: string;
}

export default function BlogEngagement({ slug }: BlogEngagementProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Comment form
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments();
    fetchLikes();
    checkIfLiked();
  }, [slug]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}/comments`);
      const data = await res.json();
      if (res.ok && data.data) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}/likes`);
      const data = await res.json();
      if (res.ok && data.data) {
        setLikes(data.data.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch likes:", error);
    }
  };

  const checkIfLiked = () => {
    const likedPosts = JSON.parse(
      localStorage.getItem("likedBlogPosts") || "{}",
    );
    setLiked(!!likedPosts[slug]);
  };

  const handleLike = async () => {
    try {
      const action = liked ? "decrement" : "increment";

      const res = await fetch(`/api/blog/${slug}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        const data = await res.json();

        // Update with the exact count from server
        if (data.data?.count !== undefined) {
          setLikes(data.data.count);
        }

        // Toggle the liked state
        const newLikedState = !liked;
        setLiked(newLikedState);

        // Update localStorage
        const likedPosts = JSON.parse(
          localStorage.getItem("likedBlogPosts") || "{}",
        );

        if (newLikedState) {
          likedPosts[slug] = true;
          toast.success("Thanks for the like!");
        } else {
          delete likedPosts[slug];
          toast.success("Like removed");
        }

        localStorage.setItem("likedBlogPosts", JSON.stringify(likedPosts));

        // Refetch to ensure we have the latest count
        setTimeout(() => fetchLikes(), 100);
      }
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !email.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, email, content }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Comment posted!");
        setAuthor("");
        setEmail("");
        setContent("");
        fetchComments();
      } else {
        toast.error(data.error || "Failed to submit comment");
      }
    } catch (error) {
      toast.error("Error submitting comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* Like Section */}
        <div className="mb-12 flex items-center justify-between rounded-lg bg-white p-6 shadow">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Found this helpful?
            </h3>
            <p className="text-sm text-gray-600">
              {likes} people found this useful
            </p>
          </div>
          <button
            onClick={handleLike}
            className={`group relative inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-200 ${
              liked
                ? "bg-red-100 text-red-600 shadow-md hover:scale-105 hover:shadow-lg active:scale-95"
                : "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md hover:scale-105 hover:shadow-lg active:scale-95"
            }`}
          >
            <span
              className={`text-xl transition-transform duration-200 ${
                liked ? "scale-125" : "group-hover:scale-125"
              }`}
            >
              {liked ? "❤️" : "🤍"}
            </span>
            <span className="hidden sm:inline">
              {liked ? "Liked" : "Like This"}
            </span>
          </button>
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Comments</h2>

          {/* Comment Form */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Leave a Comment
            </h3>

            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <textarea
                placeholder="Your comment... *"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                required
              />

              <p className="text-xs text-gray-500">
                Comments are moderated and will appear after approval
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-orange-500 px-6 py-2 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>

          {/* Comments List */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              {comments.length} Comments
            </h3>

            {comments.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-gray-200 bg-white p-6"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {comment.author}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
