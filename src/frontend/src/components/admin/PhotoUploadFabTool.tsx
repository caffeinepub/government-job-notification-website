import { useState, useRef, useEffect } from 'react';
import { Camera, Copy, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const STORAGE_KEY = 'admin-photo-upload-tool';

interface UploadState {
  dataUrl: string;
  timestamp: number;
}

export default function PhotoUploadFabTool() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UploadState = JSON.parse(stored);
        setUploadedImage(parsed.dataUrl);
      }
    } catch (error) {
      console.error('Failed to load stored image:', error);
    }
  }, []);

  // Save to localStorage whenever image changes
  useEffect(() => {
    if (uploadedImage) {
      try {
        const state: UploadState = {
          dataUrl: uploadedImage,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save image to localStorage:', error);
      }
    }
  }, [uploadedImage]);

  const handleFabClick = () => {
    if (uploadedImage) {
      setIsExpanded(!isExpanded);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImage(dataUrl);
      setIsExpanded(true);
      setImageError(false);
      setCopyStatus('idle');
    };
    reader.onerror = () => {
      alert('Failed to read image file');
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  const handleCopyLink = async () => {
    if (!uploadedImage) return;

    try {
      await navigator.clipboard.writeText(uploadedImage);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  const handleCopyHtml = async () => {
    if (!uploadedImage) return;

    const htmlCode = `<img src="${uploadedImage}" alt="Uploaded image" />`;
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  const handleClear = () => {
    setUploadedImage(null);
    setIsExpanded(false);
    setImageError(false);
    setCopyStatus('idle');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  };

  const handleNewUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Select image file"
      />

      {/* Expanded panel */}
      {isExpanded && uploadedImage && (
        <div className="fixed right-4 z-40 w-80 max-w-[calc(100vw-2rem)] photo-upload-panel">
          <Card className="shadow-lg border-2 max-h-[calc(100vh-140px)] overflow-y-auto">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Photo Upload Tool</CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="h-6 w-6"
                  aria-label="Collapse panel"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Thumbnail preview */}
              <div className="relative">
                <Label className="text-xs font-medium mb-1 block">Preview</Label>
                {imageError ? (
                  <div className="w-full h-32 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                    Preview not available
                  </div>
                ) : (
                  <img
                    src={uploadedImage}
                    alt="Uploaded preview"
                    className="w-full h-32 object-contain bg-muted rounded"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>

              {/* Direct Link / Insert Code */}
              <div>
                <Label htmlFor="data-url" className="text-xs font-medium mb-1 block">
                  Direct Link / Insert Code
                </Label>
                <Input
                  id="data-url"
                  value={uploadedImage}
                  readOnly
                  className="text-xs font-mono h-8"
                  onClick={(e) => e.currentTarget.select()}
                />
              </div>

              {/* Copy actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="flex-1 h-8 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy link
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyHtml}
                  className="flex-1 h-8 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy HTML code
                </Button>
              </div>

              {/* Status message */}
              {copyStatus === 'success' && (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Copied to clipboard!
                </div>
              )}
              {copyStatus === 'error' && (
                <div className="flex items-center gap-2 text-xs text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  Copy failed. Please select and copy manually.
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNewUpload}
                  className="flex-1 h-8 text-xs"
                >
                  Upload New
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleClear}
                  className="flex-1 h-8 text-xs"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleFabClick}
        className="fixed right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-purple-300 photo-upload-fab"
        aria-label="Upload photo"
      >
        <Camera className="w-6 h-6" />
      </button>
    </>
  );
}
