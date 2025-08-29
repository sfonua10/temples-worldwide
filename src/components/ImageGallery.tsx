import { useState, useEffect } from 'react'
import type { Temple } from '../types/temple'
import './ImageGallery.css'

interface ImageGalleryProps {
  temple: Temple
}

export function ImageGallery({ temple }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Create image array from temple data
  const images = [
    temple.images?.hero || `https://churchofjesuschrist.org/imgs/temples/${temple.name.toLowerCase().replace(/\s+/g, '-')}-temple.jpg`,
    ...(temple.images?.gallery || [])
  ].filter(Boolean)

  // Auto-advance images every 8 seconds
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [images.length, isAutoPlaying])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    setIsAutoPlaying(false)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsAutoPlaying(false)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
    setIsAutoPlaying(false)
  }

  if (images.length === 0) return null

  return (
    <div className="image-gallery">
      <div className="gallery-container">
        <div className="main-image-container">
          <img
            src={images[currentImageIndex]}
            alt={`${temple.name} Temple - Image ${currentImageIndex + 1}`}
            className="main-image ken-burns"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/1920x1080/1a1a1a/ffffff?text=Temple+Image'
            }}
          />
          
          <div className="image-overlay">
            <div className="image-info">
              <span className="image-counter">{currentImageIndex + 1} of {images.length}</span>
              {temple.images?.gallery && temple.images.gallery[currentImageIndex - 1] && (
                <span className="image-title">{temple.name} Temple</span>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <>
              <button className="nav-button prev" onClick={prevImage} aria-label="Previous image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18L9 12L15 6" />
                </svg>
              </button>
              
              <button className="nav-button next" onClick={nextImage} aria-label="Next image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18L15 12L9 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="thumbnail-strip">
            {images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => goToImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${temple.name} Temple thumbnail ${index + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/200x120/1a1a1a/ffffff?text=Temple'
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="gallery-controls">
            <button
              className={`control-button ${isAutoPlaying ? 'active' : ''}`}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              aria-label={isAutoPlaying ? 'Pause slideshow' : 'Start slideshow'}
            >
              {isAutoPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <span className="control-label">
              {isAutoPlaying ? 'Auto-playing' : 'Paused'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}