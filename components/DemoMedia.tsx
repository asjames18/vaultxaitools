import React, { useState } from 'react';
import { Play, Image, Video, ExternalLink, Maximize2, X } from 'lucide-react';

interface DemoImage {
  url: string;
  alt: string;
  description: string;
  type: string;
}

interface DemoVideo {
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: string;
  type: string;
}

interface DemoGalleryItem {
  url: string;
  alt: string;
  description: string;
  type: string;
}

interface DemoMediaProps {
  demo_images?: DemoImage[];
  demo_videos?: DemoVideo[];
  demo_gallery?: DemoGalleryItem[];
  toolName: string;
}

export default function DemoMedia({ demo_images, demo_videos, demo_gallery, toolName }: DemoMediaProps) {
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video' | 'gallery'; item: any } | null>(null);
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'gallery'>('images');

  const hasImages = demo_images && demo_images.length > 0;
  const hasVideos = demo_videos && demo_videos.length > 0;
  const hasGallery = demo_gallery && demo_gallery.length > 0;

  if (!hasImages && !hasVideos && !hasGallery) {
    return null;
  }

  const openMediaModal = (type: 'image' | 'video' | 'gallery', item: any) => {
    setSelectedMedia({ type, item });
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Demo & Media</h3>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-white/10 rounded-lg p-1">
        {hasImages && (
          <button
            onClick={() => setActiveTab('images')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'images'
                ? 'bg-white text-gray-900'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Image className="w-4 h-4 inline mr-2" />
            Images ({demo_images?.length || 0})
          </button>
        )}
        {hasVideos && (
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'videos'
                ? 'bg-white text-gray-900'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 inline mr-2" />
            Videos ({demo_videos?.length || 0})
          </button>
        )}
        {hasGallery && (
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'gallery'
                ? 'bg-white text-gray-900'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Maximize2 className="w-4 h-4 inline mr-2" />
            Gallery ({demo_gallery?.length || 0})
          </button>
        )}
      </div>

      {/* Content Tabs */}
      <div className="space-y-4">
        {/* Images Tab */}
        {activeTab === 'images' && hasImages && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demo_images.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all"
                onClick={() => openMediaModal('image', image)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {image.type}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-white/90 text-sm font-medium">{image.alt}</p>
                  <p className="text-white/70 text-xs mt-1">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && hasVideos && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demo_videos.map((video, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all"
                onClick={() => openMediaModal('video', video)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-3 group-hover:bg-red-500 transition-colors">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {video.type}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-white/90 text-sm font-medium">{video.title}</p>
                  <p className="text-white/70 text-xs mt-1">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && hasGallery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demo_gallery.map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all"
                onClick={() => openMediaModal('gallery', item)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {item.type}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-white/90 text-sm font-medium">{item.alt}</p>
                  <p className="text-white/70 text-xs mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {selectedMedia.type === 'image' && (
              <div className="bg-white rounded-lg overflow-hidden">
                <img
                  src={selectedMedia.item.url}
                  alt={selectedMedia.item.alt}
                  className="w-full h-auto"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedMedia.item.alt}</h3>
                  <p className="text-gray-600 mt-2">{selectedMedia.item.description}</p>
                  <div className="mt-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {selectedMedia.item.type}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedMedia.type === 'video' && (
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedMedia.item.url)}
                    title={selectedMedia.item.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedMedia.item.title}</h3>
                  <p className="text-gray-600 mt-2">{selectedMedia.item.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      {selectedMedia.item.type}
                    </span>
                    <span className="text-gray-500 text-sm">{selectedMedia.item.duration}</span>
                  </div>
                </div>
              </div>
            )}

            {selectedMedia.type === 'gallery' && (
              <div className="bg-white rounded-lg overflow-hidden">
                <img
                  src={selectedMedia.item.url}
                  alt={selectedMedia.item.alt}
                  className="w-full h-auto"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedMedia.item.alt}</h3>
                  <p className="text-gray-600 mt-2">{selectedMedia.item.description}</p>
                  <div className="mt-3">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {selectedMedia.item.type}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
