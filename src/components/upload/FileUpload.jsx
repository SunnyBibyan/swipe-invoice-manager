import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { storage } from '../../config/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { processFile } from '../../utils/fileProcessor';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function FileUpload({ onUploadComplete }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsProcessing(true);
    try {
      for (const file of acceptedFiles) {
        const storageRef = ref(storage, `uploads/${file.name}`);
        await uploadBytes(storageRef, file);
        const data = await processFile(file);
        onUploadComplete(data);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
    setIsProcessing(false);
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop files, or click to select"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Support for Excel, PDF, and image files
        </p>
      </div>
      {isProcessing && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Processing your files...
        </div>
      )}
    </div>
  );
}