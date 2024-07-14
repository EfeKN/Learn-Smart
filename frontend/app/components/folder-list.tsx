import React, {useState} from 'react';
import Folder from '@/app/components/folder';

interface FolderType {
  name: string;
  folders: FolderType[];
}

interface FolderListProps {
  folders: FolderType[];
  handleDrop: (item: FolderType, targetFolder: FolderType) => void;
}

const FolderList: React.FC<FolderListProps> = ({ folders, handleDrop }) => {
  const [openFolders, setOpenFolders] = useState<string[]>([]);

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prevOpenFolders) =>
      prevOpenFolders.includes(folderName)
        ? prevOpenFolders.filter((name) => name !== folderName)
        : [...prevOpenFolders, folderName]
    );
  };

  return (
    <div className="folder-list grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {folders.map((folder, index) => (
        <Folder
          key={index}
          folder={folder}
          onDrop={handleDrop}
          toggleFolder={toggleFolder}
          isOpen={openFolders.includes(folder.name)}
        />
      ))}
    </div>
  );
};

export default FolderList;
