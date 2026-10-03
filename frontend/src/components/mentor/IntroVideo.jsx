import { useState } from "react";

/**
 * Lazy-loaded YouTube embed. Only loads the iframe when the user clicks play.
 */
export default function IntroVideo({ videoId }) {
  const [loaded, setLoaded] = useState(false);

  if (!videoId) return null;

  if (!loaded) {
    return (
      <div
        className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => setLoaded(true)}
      >
        {/* Thumbnail */}
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="Video thumbnail"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#e07a5f]/90 flex items-center justify-center group-hover:bg-[#e07a5f] group-hover:scale-110 transition-all duration-200">
            <svg
              className="w-7 h-7 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white text-sm font-medium">▶ Watch introduction video</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title="Mentor introduction"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
