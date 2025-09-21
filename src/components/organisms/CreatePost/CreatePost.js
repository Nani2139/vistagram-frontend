import React, { useState, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import Icon from "../../atoms/Icon/Icon";

const CreatePostContainer = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dbdbdb;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #262626;
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  color: #8e8e8e;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fafb;
    color: #262626;
  }
`;

const ImageSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f3f4f6;
  margin-bottom: 1rem;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;


const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const CameraButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border: 2px dashed #dbdbdb;
  border-radius: 8px;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #8e8e8e;

  &:hover {
    border-color: #0095f6;
    color: #0095f6;
    background-color: #f0f9ff;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: space-between;

  button {
    flex: 1;
  }
`;

const CreatePost = ({ onSubmit, onCancel, loading = false, className }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setShowCamera(true);
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
          alert(
            "Unable to access camera. Please try uploading an image instead."
          );
        });
    } else {
      alert("Camera not supported. Please try uploading an image instead.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL("image/jpeg");
      setImage(imageData);
      setShowCamera(false);

      // Stop the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const closeCamera = () => {
    setShowCamera(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!image || !caption.trim()) {
      alert("Please add an image and caption");
      return;
    }

    const postData = {
      image,
      caption: caption.trim(),
      location: location.trim() || null,
    };

    onSubmit(postData);
  };

  const isFormValid = image && caption.trim();

  return (
    <CreatePostContainer
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Header>
        <Title>Create New Post</Title>
        <CloseButton onClick={onCancel}>
          <Icon size="medium">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Icon>
        </CloseButton>
      </Header>

      <ImageSection>
        <AnimatePresence mode="wait">
          {image ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ImagePreview>
                <PreviewImage src={image} alt="Preview" />
                <RemoveImageButton onClick={removeImage}>
                  <Icon size="small">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Icon>
                </RemoveImageButton>
              </ImagePreview>
            </motion.div>
          ) : showCamera ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ImagePreview>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  <Button variant="primary" onClick={capturePhoto}>
                    Capture
                  </Button>
                  <Button variant="secondary" onClick={closeCamera}>
                    Cancel
                  </Button>
                </div>
              </ImagePreview>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CameraButton onClick={handleCameraClick}>
                <Icon size="xlarge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </Icon>
                <div>
                  <p>Take a photo or upload an image</p>
                  <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                    Click to use camera or choose from gallery
                  </p>
                </div>
              </CameraButton>
              <HiddenInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose from Gallery
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ImageSection>

      <FormSection>
        <Input
          label="Caption"
          placeholder="What's interesting about this place?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={2200}
          helperText={`${caption.length}/2200 characters`}
        />
        <Input
          label="Location (optional)"
          placeholder="Where is this place?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </FormSection>

      <ActionButtons>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={!isFormValid || loading}
        >
          Share Post
        </Button>
      </ActionButtons>
    </CreatePostContainer>
  );
};

export default CreatePost;
