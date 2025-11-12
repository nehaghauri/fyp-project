import React, { useState, useRef } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader, Search } from 'lucide-react';
import { knowledgeBaseManager } from '@/lib/knowledgeBaseManager';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  category: string;
  chunks?: number;
  error?: string;
}

const KnowledgeBasePage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('odoo_docs');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'odoo_docs', label: '📘 Odoo Documentation' },
    { value: 'brand_faqs', label: '❓ Brand FAQs' },
    { value: 'psychology', label: '🧠 Customer Psychology' },
    { value: 'project_docs', label: '📋 Project Docs' },
    { value: 'other', label: '📁 Other' }
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const newFiles: UploadedFile[] = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'pending',
      category: selectedCategory
    }));

    setFiles(prev => [...prev, ...newFiles]);
    await processFiles(selectedFiles, newFiles);
  };

  const processFiles = async (selectedFiles: File[], fileMetadata: UploadedFile[]) => {
    setIsProcessing(true);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const metadata = fileMetadata[i];

      try {
        // Update status to processing
        setFiles(prev => prev.map(f => 
          f.id === metadata.id ? { ...f, status: 'processing' } : f
        ));

        // Actually process the file using knowledgeBaseManager
        await knowledgeBaseManager.uploadFile(file, selectedCategory);

        // Get actual chunk count from the stats
        const docsByCategory = knowledgeBaseManager.getDocumentsByCategory(selectedCategory);
        const chunks = docsByCategory.filter(d => d.metadata.filename === file.name).length;

        // Update status to completed
        setFiles(prev => prev.map(f => 
          f.id === metadata.id 
            ? { ...f, status: 'completed', chunks } 
            : f
        ));

      } catch (error: any) {
        setFiles(prev => prev.map(f => 
          f.id === metadata.id 
            ? { ...f, status: 'error', error: error.message || 'Failed to process file' } 
            : f
        ));
      }
    }

    setIsProcessing(false);
  };

  const handleDelete = (id: string, filename: string) => {
    // Remove from UI
    setFiles(prev => prev.filter(f => f.id !== id));
    
    // Remove from knowledge base
    knowledgeBaseManager.removeDocument(filename);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await knowledgeBaseManager.search(searchQuery, 5);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
      case 'processing':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const stats = {
    total: files.length,
    completed: files.filter(f => f.status === 'completed').length,
    processing: files.filter(f => f.status === 'processing').length,
    error: files.filter(f => f.status === 'error').length,
    totalChunks: files.reduce((sum, f) => sum + (f.chunks || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Knowledge Base Manager
          </h1>
          <p className="text-gray-600">
            Upload and manage documents for your RAG-powered chatbot
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Total Files</div>
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Processing</div>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Errors</div>
            <div className="text-2xl font-bold text-red-600">{stats.error}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Total Chunks</div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalChunks}</div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Search</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search your knowledge base..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold text-gray-700">Results:</h3>
              {searchResults.map((result, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{result.document.metadata.filename}</span>
                    <span className="text-purple-600">{(result.similarity * 100).toFixed(1)}% match</span>
                  </div>
                  <p className="text-sm text-gray-600">{result.document.content.substring(0, 200)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Documents</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              PDF, DOCX, HTML, TXT, CSV files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.html,.txt,.csv,.md"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Uploaded Files</h2>
          
          {files.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map(file => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(file.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.category}
                        {file.chunks && ` • ${file.chunks} chunks`}
                      </p>
                      {file.error && (
                        <p className="text-sm text-red-500 mt-1">{file.error}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(file.id, file.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={file.status === 'processing'}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;