import React, { useState } from 'react';
import { allPhpFiles } from '../../data/allPhpFiles';
import { useApp } from '../../context/AppContext';
import JSZip from 'jszip';

export const CodeExplorer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(allPhpFiles[0].path);
  const [copied, setCopied] = useState<boolean>(false);
  const { showToast } = useApp();

  const currentFile = allPhpFiles.find(f => f.path === selectedFilePath) || allPhpFiles[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    showToast(`Copied ${currentFile.name} to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();

      // Add each file to its exact relative directory
      allPhpFiles.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Add README.md
      const readme = `# Adept Play - Esports Tournament & UPI Wallet System
Built with PHP, MySQL, Tailwind CSS & Font Awesome.

## 🚀 Setup Instructions:
1. Copy all folders and files to your local server directory (\`htdocs\` for XAMPP or \`www\` for WAMP/cPanel).
2. Configure MySQL credentials in \`common/config.php\` (Default: 127.0.0.1, root, root).
3. Open your browser and visit:
   \`http://localhost/install.php\`
   This will create the database, all 8 tables, default admin (admin / admin123), and sample settings.
4. For existing databases, run:
   \`http://localhost/update_database.php\`
   This safely adds deposits, withdrawals, and UPI ID fields without deleting existing data.

## 👑 Admin Panel:
- URL: \`http://localhost/admin/\`
- Username: \`admin\`
- Password: \`admin123\`
- Settings Page: \`http://localhost/admin/settings.php\` (Upload QR code & set UPI ID)
`;
      zip.file('README.md', readme);

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'adept-play-php-mysql.zip';
      link.click();
      showToast('Downloaded adept-play-php-mysql.zip successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to create ZIP package.', 'error');
    }
  };

  const categories = [
    { key: 'root', label: 'Root User Pages' },
    { key: 'common', label: 'Common Inclusions' },
    { key: 'admin', label: 'Admin Panel Pages' },
    { key: 'admin_common', label: 'Admin Common' },
    { key: 'sql', label: 'Database & Migration Scripts' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Download Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30">
              PHP + MySQL + Tailwind CSS
            </span>
            <span className="text-xs text-slate-400 font-mono">Total {allPhpFiles.length} source files</span>
          </div>
          <h2 className="text-xl font-black text-white">PHP / MySQL Source Code Repository</h2>
          <p className="text-xs text-slate-400">
            Complete, pure PHP form submission codebase without frameworks or AJAX. Ready for cPanel / XAMPP deployment.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all whitespace-nowrap"
        >
          <i className="fa-solid fa-file-zipper text-sm"></i>
          <span>Download Complete Project (.ZIP)</span>
        </button>
      </div>

      {/* Two-Column Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar File Tree */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-4 shadow-xl h-fit">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider px-2">
            Project File Tree
          </h3>

          <div className="space-y-4">
            {categories.map(cat => {
              const files = allPhpFiles.filter(f => f.category === cat.key);
              if (files.length === 0) return null;
              return (
                <div key={cat.key} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
                    {cat.label}
                  </span>
                  <div className="space-y-1">
                    {files.map(file => {
                      const isSelected = file.path === selectedFilePath;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFilePath(file.path)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <i className={`fa-regular ${file.path.endsWith('.php') ? 'fa-file-code' : 'fa-file'} text-xs ${isSelected ? 'text-slate-950' : 'text-amber-400'}`}></i>
                            <span className="truncate font-mono">{file.path}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-amber-300">{currentFile.path}</span>
                <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {currentFile.content.split('\n').length} lines
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{currentFile.description}</p>
            </div>

            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <i className={`fa-regular ${copied ? 'fa-circle-check text-emerald-400' : 'fa-copy'}`}></i>
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code Window */}
          <div className="p-4 bg-slate-950/90 overflow-x-auto max-h-[650px] font-mono text-xs text-slate-300 leading-relaxed select-text">
            <pre>
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
