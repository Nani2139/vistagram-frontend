import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const withHomepageScreen = (WrappedComponent) => {
  return function HomepageScreenContainer(props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [allPosts, setAllPosts] = useState([]);
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const location = useLocation();

    // Reset state when navigating to homepage
    useEffect(() => {
      if (location.pathname === "/") {
        setCurrentPage(1);
        setAllPosts([]);
        // Invalidate and refetch the feed to ensure fresh data
        queryClient.invalidateQueries(["feed"]);
      }
    }, [location.pathname, queryClient]);

    // Fetch feed posts (from followed users + own posts)
    const {
      data: postsData,
      isLoading: postsLoading,
      error: postsError,
      refetch: refetchPosts,
    } = useQuery(["feed", currentPage], () => api.getFeed(currentPage), {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!user, // Only fetch if user is logged in
      onSuccess: (data) => {
        console.log("Feed loaded successfully:", data);
        if (currentPage === 1) {
          // Reset posts for first page
          setAllPosts(data.posts || []);
        } else {
          // Append new posts for subsequent pages
          setAllPosts((prev) => [...prev, ...(data.posts || [])]);
        }
      },
      onError: (error) => {
        console.error("Error loading feed:", error);
      },
    });

    // Like/Unlike mutation
    const likeMutation = useMutation(
      ({ postId, newIsLikedState }) =>
        newIsLikedState ? api.likePost(postId) : api.unlikePost(postId),
      {
        onMutate: async ({ postId, newIsLikedState }) => {
          // Cancel any outgoing refetches
          await queryClient.cancelQueries(["feed", currentPage]);

          // Snapshot the previous value
          const previousData = queryClient.getQueryData(["feed", currentPage]);

          // Optimistically update to the new value
          setAllPosts((prev) =>
            prev.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    isLiked: newIsLikedState,
                    likeCount: newIsLikedState
                      ? (post.likeCount || 0) + 1
                      : Math.max(0, (post.likeCount || 0) - 1),
                  }
                : post
            )
          );

          queryClient.setQueryData(["feed", currentPage], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              posts: oldData.posts.map((post) =>
                post._id === postId
                  ? {
                      ...post,
                      isLiked: newIsLikedState,
                      likeCount: newIsLikedState
                        ? (post.likeCount || 0) + 1
                        : Math.max(0, (post.likeCount || 0) - 1),
                    }
                  : post
              ),
            };
          });

          // Return a context object with the snapshotted value
          return { previousData };
        },
        onSuccess: (data, variables) => {
          // Update with the actual server response
          setAllPosts((prev) =>
            prev.map((post) =>
              post._id === variables.postId
                ? {
                    ...post,
                    isLiked: data.data.isLiked,
                    likeCount: data.data.likeCount,
                  }
                : post
            )
          );

          queryClient.setQueryData(["feed", currentPage], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              posts: oldData.posts.map((post) =>
                post._id === variables.postId
                  ? {
                      ...post,
                      isLiked: data.data.isLiked,
                      likeCount: data.data.likeCount,
                    }
                  : post
              ),
            };
          });
        },
        onError: (error, variables, context) => {
          // If the mutation fails, use the context returned from onMutate to roll back
          if (context?.previousData) {
            queryClient.setQueryData(
              ["feed", currentPage],
              context.previousData
            );
          }
          toast.error("Failed to update like");
          console.error("Like error:", error);
        },
      }
    );

    // Share mutation
    const shareMutation = useMutation((postId) => api.sharePost(postId), {
      onMutate: async (postId) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(["feed", currentPage]);

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(["feed", currentPage]);

        // Optimistically update the share count
        setAllPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isShared: true,
                  shareCount: (post.shareCount || 0) + 1,
                }
              : post
          )
        );

        queryClient.setQueryData(["feed", currentPage], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            posts: oldData.posts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    isShared: true,
                    shareCount: (post.shareCount || 0) + 1,
                  }
                : post
            ),
          };
        });

        // Return a context object with the snapshotted value
        return { previousData };
      },
      onSuccess: (data, postId) => {
        // Update the allPosts state
        setAllPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isShared: data.data.isShared,
                  shareCount: data.data.shareCount,
                }
              : post
          )
        );

        // Update the specific post in cache
        queryClient.setQueryData(["feed", currentPage], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            posts: oldData.posts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    isShared: data.data.isShared,
                    shareCount: data.data.shareCount,
                  }
                : post
            ),
          };
        });

        // Copy link to clipboard
        const postUrl = `${window.location.origin}/post/${postId}`;
        navigator.clipboard
          .writeText(postUrl)
          .then(() => {
            toast.success("Post link copied to clipboard!");
          })
          .catch(() => {
            toast.success("Post shared successfully!");
          });

        // Invalidate and refetch to ensure consistency
        queryClient.invalidateQueries(["feed"]);
      },
      onError: (error, postId, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (context?.previousData) {
          queryClient.setQueryData(["feed", currentPage], context.previousData);
        }

        console.error("Share error:", error);

        // Check if it's an authentication error
        if (error?.response?.status === 401) {
          toast.error("Please log in to share posts");
          // Redirect to login page
          window.location.href = "/login";
        } else {
          toast.error("Failed to share post");
        }
      },
    });

    // Comment mutation
    const commentMutation = useMutation(
      ({ postId, text }) => api.addComment(postId, text),
      {
        onSuccess: (data, variables) => {
          // Update the allPosts state
          setAllPosts((prev) =>
            prev.map((post) =>
              post._id === variables.postId
                ? {
                    ...post,
                    commentCount: (post.commentCount || 0) + 1,
                    comments: [...(post.comments || []), data],
                  }
                : post
            )
          );

          // Update the specific post in cache
          queryClient.setQueryData(["feed", currentPage], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              posts: oldData.posts.map((post) =>
                post._id === variables.postId
                  ? {
                      ...post,
                      commentCount: (post.commentCount || 0) + 1,
                      comments: [...(post.comments || []), data],
                    }
                  : post
              ),
            };
          });

          toast.success("Comment added successfully!");

          // Invalidate and refetch to ensure consistency
          queryClient.invalidateQueries(["feed"]);
        },
        onError: (error) => {
          toast.error("Failed to add comment");
          console.error("Comment error:", error);
        },
      }
    );

    // Handlers
    const handleLike = (postId, newIsLikedState) => {
      likeMutation.mutate({ postId, newIsLikedState });
    };

    const handleShare = (postId) => {
      // Check if user is authenticated
      if (!user) {
        // If not authenticated, just copy the link without tracking
        const postUrl = `${window.location.origin}/post/${postId}`;
        navigator.clipboard
          .writeText(postUrl)
          .then(() => {
            toast.success("Post link copied to clipboard!");
          })
          .catch(() => {
            toast.success("Post shared successfully!");
          });
        return;
      }

      // If authenticated, track the share
      shareMutation.mutate(postId);
    };

    const handleComment = (postId, text) => {
      if (!text || !text.trim()) {
        toast.error("Please enter a comment");
        return;
      }
      commentMutation.mutate({ postId, text: text.trim() });
    };

    const handleUserClick = (userId) => {
      // Navigate to user profile
      window.location.href = `/profile/${userId}`;
    };

    const handleRefresh = () => {
      setCurrentPage(1);
      setAllPosts([]);
      refetchPosts();
    };

    const handleLoadMore = () => {
      if (postsData?.pagination?.hasNext) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    // Screen data
    const screenData = {
      posts: allPosts,
      pagination: postsData?.pagination || null,
      loading: postsLoading,
      error: postsError,
      refreshing:
        likeMutation.isLoading ||
        shareMutation.isLoading ||
        commentMutation.isLoading,
      hasNextPage: postsData?.pagination?.hasNext || false,
      isFetchingNextPage: false, // This would be handled by infinite query in a real implementation
    };

    // Screen actions
    const screenActions = {
      onLike: handleLike,
      onShare: handleShare,
      onComment: handleComment,
      onUserClick: handleUserClick,
      onRefresh: handleRefresh,
      onLoadMore: handleLoadMore,
      fetchPosts: () => api.getFeed(currentPage),
    };

    return (
      <WrappedComponent
        {...props}
        screenData={screenData}
        screenActions={screenActions}
      />
    );
  };
};

export default withHomepageScreen;
