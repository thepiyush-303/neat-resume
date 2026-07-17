import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function DashboardLayout() {

    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<string>("")
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        // console.log(files)

        if (files && files[0]) {
            if(files[0].type != "application/pdf"){
              setStatus("file type not supported")
              return;
            }
            setFile(files[0])
            setStatus("File selected")
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setStatus('Uploading and preparing for extraction...');

        const formData = new FormData();
        formData.append('resume', file);
        try {

            const response = await fetch('http://localhost:8000/api/resume/upload', {
                method: 'POST',
                body: formData
            });

            // console.log(response);
            const result = await response.json();
            // console.log(result)

            if (response.ok && result.success) {
                setStatus(`Success! Extracted data for: ${result.data.fileName}`);
            } else {
                setStatus(`Upload failed: ${result.message || 'Unknown error occurred'}`);
            }
        } catch (error) {
            console.error('Error connecting to backend:', error);
            setStatus('Failed to connect to the server. Is your Node.js backend running?');
        } finally {
            setIsUploading(false);
        }

    };

    return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Portfolio</h1>
        <p className="text-gray-500 mt-2">
          Upload your resume to instantly generate a developer portfolio.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
          <UploadCloud className="text-gray-400 mb-4" size={48} />
          
          <label className={`cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors">
              Browse Files
            </span>
            <input 
              type="file" 
              accept=".pdf,.docx" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          
          <p className="text-sm text-gray-500 mt-4">PDF or DOCX up to 5MB</p>
          
          {file && (
            <div className="mt-6 p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2 w-full max-w-xs justify-center">
              <span className="font-medium truncate">{file.name}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isUploading ? 'Processing...' : 'Upload & Extract Data'}
          </button>
        </div>
        
        {status && (
          <p className={`text-center mt-4 text-sm font-medium ${status.includes('failed') || status.includes('Failed') ? 'text-red-600' : 'text-gray-700'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};