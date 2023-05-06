import { parseYaml } from "./parseYaml";
import React, { useCallback, useState } from 'react';
import components from '@/styles/components.module.css';
import { StoryInit } from "@/server/procedures/post/type";
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";

interface FileDropZoneProps {
  onFileRead: (fileContent: string) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileRead }) => {
  const handleFileRead = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files.length === 0) return;

      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const fileContent = event.target?.result;
        if (typeof fileContent === 'string') {
          onFileRead(fileContent);
        }
      };
      reader.readAsText(file);
    },
    [onFileRead]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '200px',
        border: '2px dashed #999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onDrop={handleFileRead}
      onDragOver={handleDragOver}
    >
      ドラッグしてファイルを読み込む
    </div>
  );
};

export const NewStoryYaml = () => {
    const [yaml,setYaml] = useState<StoryInit | null>(null);
    const router = useRouter();
    const {mutate,isLoading,isSuccess} = trpc.post.useMutation();

    const handleFileRead = useCallback((fileContent: string) => {
        const parsed = parseYaml(fileContent);
        if(parsed.success){
            setYaml(parsed.data);
        }
    }, [setYaml]);

    if(isLoading){
        return <p>投稿中</p>
    }

    if(isSuccess){
        return <p>投稿しました。</p>
    }
    
    return (
        <div>
            <FileDropZone onFileRead={handleFileRead} />
            {yaml && <button onClick={() => {
                mutate(yaml,{
                    onSuccess: (data) => {
                        router.push(`/stories/${data.id}`);
                    }
                });
            }} className={components.button}>
                投稿
            </button>}
        </div>
    );
}

