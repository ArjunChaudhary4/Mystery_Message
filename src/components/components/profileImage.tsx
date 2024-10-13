"use client";
import { CldImage } from 'next-cloudinary';

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function ProfileImage() {
  return (
    <CldImage
      src="cld-sample-4" // Use this sample image or upload your own via the Media Explorer
      width="40" // Transform the image: auto-crop to square aspect_ratio
      height="40"
      radius={200}
      alt='Profile Image'
      crop={{
        type: 'auto',
        source: true
      }}
    />
  );
}