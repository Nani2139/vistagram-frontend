import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const withCreatePostScreen = (WrappedComponent) => {
  return function CreatePostScreenContainer(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Create post mutation
    const createPostMutation = useMutation(
      (postData) => api.createPost(postData),
      {
        onSuccess: (data) => {
          toast.success("Post created successfully!");

          // Invalidate both posts and feed queries to refresh the feed
          queryClient.invalidateQueries(["posts"]);
          queryClient.invalidateQueries(["feed"]);

          // Navigate back to home
          navigate("/");
        },
        onError: (error) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to create post";
          toast.error(errorMessage);
          console.error("Create post error:", error);
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );

    // Handlers
    const handleSubmit = async (postData) => {
      setLoading(true);

      try {
        // Convert base64 image to blob if needed

        if (postData.image.startsWith("data:image")) {
          // Convert base64 to blob
          const response = await fetch(postData.image);
          if (!response.ok) {
            throw new Error("Failed to process image");
          }
          const blob = await response.blob();

          // Create FormData
          const formData = new FormData();
          formData.append("image", blob, "image.jpg");
          formData.append("caption", postData.caption);
          if (postData.location) {
            formData.append(
              "location",
              JSON.stringify({ name: postData.location })
            );
          }

          createPostMutation.mutate(formData);
        } else {
          // If it's already a file or URL
          createPostMutation.mutate(postData);
        }
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Error processing image: " + error.message);
        setLoading(false);
      }
    };

    const handleCancel = () => {
      navigate("/");
    };

    // Screen data
    const screenData = {
      loading,
      error: createPostMutation.error,
    };

    // Screen actions
    const screenActions = {
      onSubmit: handleSubmit,
      onCancel: handleCancel,
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

export default withCreatePostScreen;
