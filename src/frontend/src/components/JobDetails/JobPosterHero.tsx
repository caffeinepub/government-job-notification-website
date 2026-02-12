import React, { useState } from 'react';

interface JobPosterHeroProps {
  posterImage?: string | null;
  jobName: string;
}

export default function JobPosterHero({ posterImage, jobName }: JobPosterHeroProps) {
  const [imageError, setImageError] = useState(false);

  if (posterImage && !imageError) {
    return (
      <div className="w-full mb-6 rounded-lg overflow-hidden shadow-lg">
        <img
          src={posterImage}
          alt={`${jobName} poster`}
          className="w-full h-64 md:h-80 lg:h-96 object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Default gradient fallback when no image or image fails to load
  return (
    <div className="w-full mb-6 rounded-lg overflow-hidden shadow-lg">
      <div className="w-full h-48 md:h-64 bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
            {jobName}
          </h2>
        </div>
      </div>
    </div>
  );
}
