
import React, { useState } from 'react';
import { X, Upload, Music } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';

/**
 * SoundUploadModal Component
 * 
 * Handles uploading new sounds to the database using PocketBase's file storage.
 */
const SoundUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Effects');
  const [file, setFile] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  // Validate and handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Basic MIME type validation
      const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm'];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(wav|mp3|ogg|webm)$/i)) {
        toast.error('Only WAV, MP3, OGG, and WEBM files are allowed.');
        e.target.value = '';
        return;
      }
      
      // Basic file size validation (max 100MB based on schema)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB.');
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!file) {
      toast.error('Please select an audio file');
      return;
    }

    setIsUploading(true);

    try {
      // Construct FormData for submission
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      
      // Append the actual file to the new audioFile field
      formData.append('audioFile', file);
      
      // Provide a dummy value for the legacy audioUrl text field since it's marked as required in the schema
      formData.append('audioUrl', 'uploaded-via-file'); 
      
      // Save to PocketBase
      await pb.collection('sounds').create(formData, {
        $autoCancel: false
      });

      toast.success('Sound uploaded successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Effects');
      setFile(null);
      
      // Notify parent to refresh list
      if (onSuccess) onSuccess();
      
      onClose();

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message || 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const categories = ['Drums', 'Bass', 'Synths', 'Ambient', 'Vocals', 'Effects'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          disabled={isUploading}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 border-b border-border/50">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary" />
            Add a Sound
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Upload a new audio file to the library.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          <div>
            <label className="block text-sm font-bold mb-2 text-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Heavy Bass Drop"
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-foreground">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isUploading}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-foreground">
              Description
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the sound..."
              rows={2}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-foreground">
              Audio File <span className="text-destructive">*</span>
            </label>
            
            <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-6 text-center transition-colors bg-input/50">
              <input 
                type="file" 
                accept=".wav,.mp3,audio/wav,audio/mpeg,audio/ogg,audio/webm" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              
              <div className="flex flex-col items-center pointer-events-none">
                <Music className={`w-8 h-8 mb-2 ${file ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium text-foreground">
                  {file ? file.name : 'Click or drag file here'}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  WAV, MP3, OGG (Max 100MB)
                </span>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-bold mt-2"
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </div>
            ) : (
              'Upload Sound'
            )}
          </Button>

        </form>
      </div>
    </div>
  );
};

export default SoundUploadModal;
