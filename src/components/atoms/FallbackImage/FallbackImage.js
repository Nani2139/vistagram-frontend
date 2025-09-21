import React, { useState } from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
`;

const FallbackContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 1rem;
`;

const FallbackIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
`;

const FallbackText = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
`;

const FallbackImage = ({ src, alt, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Construct the full image URL if src is a relative path
  const getImageUrl = (imageSrc) => {
    if (!imageSrc) return null;
    if (imageSrc.startsWith("http")) return imageSrc;
    if (imageSrc.startsWith("/uploads/")) {
      const backendUrl =
        process.env.REACT_APP_API_URL || "http://localhost:5000";
      return `${backendUrl}${imageSrc}`;
    }
    return imageSrc;
  };

  const [currentSrc, setCurrentSrc] = useState(getImageUrl(src));

  // Fallback images for different landmarks
  const fallbackImages = [
    "https://picsum.photos/800/600?random=1",
    "https://picsum.photos/800/600?random=2",
    "https://picsum.photos/800/600?random=3",
    "https://picsum.photos/800/600?random=4",
    "https://picsum.photos/800/600?random=5",
  ];

  const handleImageError = () => {
    if (!imageError) {
      // Try fallback images
      const randomFallback =
        fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
      setCurrentSrc(randomFallback);
      setImageError(true);
    } else {
      // If fallback also fails, show placeholder
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  if (imageError && currentSrc === getImageUrl(src)) {
    return (
      <ImageContainer>
        <FallbackContainer>
          <FallbackIcon>📸</FallbackIcon>
          <FallbackText>Image not available</FallbackText>
        </FallbackContainer>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer>
      <StyledImage
        src={currentSrc}
        alt={alt}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ opacity: imageLoaded ? 1 : 0 }}
        {...props}
      />
      {!imageLoaded && !imageError && (
        <FallbackContainer>
          <FallbackIcon>⏳</FallbackIcon>
          <FallbackText>Loading...</FallbackText>
        </FallbackContainer>
      )}
    </ImageContainer>
  );
};

export default FallbackImage;
