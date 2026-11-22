import * as React from 'react';
import { cn } from '@/lib/utils';
import { FileText, Film, ImagePlus, Upload } from 'lucide-react';
import { Spinner } from './spinner';

type FileType = 'image' | 'video' | 'document' | 'all';

interface DropzoneFile {
    id?: string;
    url: string;
    name?: string;
}

const ACCEPT_MAP: Record<FileType, string> = {
    image: 'image/*',
    video: 'video/*',
    document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv',
    all: '*',
};

const LABEL_MAP: Record<FileType, string> = {
    image: 'PNG, JPG, WEBP up to 10MB',
    video: 'MP4, WEBM, MOV up to 50MB',
    document: 'PDF, DOC, XLS, PPT, TXT',
    all: 'Any file type',
};

const ICON_MAP: Record<FileType, React.ReactNode> = {
    image: <ImagePlus className="size-8 text-gray-400" />,
    video: <Film className="size-8 text-gray-400" />,
    document: <FileText className="size-8 text-gray-400" />,
    all: <Upload className="size-8 text-gray-400" />,
};

interface FileDropzoneProps {
    value: DropzoneFile[];
    onChange: (files: DropzoneFile[]) => void;
    onUpload: (file: File) => Promise<DropzoneFile | undefined>;
    fileType?: FileType;
    isUploading?: boolean;
    disabled?: boolean;
    className?: string;
}

function FileDropzone({
    value = [],
    onChange,
    onUpload,
    fileType = 'image',
    isUploading = false,
    disabled = false,
    className,
}: Readonly<FileDropzoneProps>) {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [uploadingCount, setUploadingCount] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFiles = React.useCallback(
        async (files: FileList | File[]) => {
            const fileArray = Array.from(files);
            if (fileArray.length === 0) return;

            setUploadingCount((prev) => prev + fileArray.length);

            const results = await Promise.allSettled(fileArray.map((file) => onUpload(file)));

            const newFiles: DropzoneFile[] = [];
            for (const result of results) {
                if (result.status === 'fulfilled' && result.value) {
                    newFiles.push(result.value);
                }
            }

            if (newFiles.length > 0) {
                onChange([...value, ...newFiles]);
            }

            setUploadingCount((prev) => prev - fileArray.length);
        },
        [onUpload, onChange, value],
    );

    const handleDrop = React.useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            if (disabled) return;
            handleFiles(e.dataTransfer.files);
        },
        [disabled, handleFiles],
    );

    const handleDragOver = React.useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            if (!disabled) setIsDragOver(true);
        },
        [disabled],
    );

    const handleDragLeave = React.useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleClick = React.useCallback(() => {
        if (!disabled) inputRef.current?.click();
    }, [disabled]);

    const handleInputChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                handleFiles(e.target.files);
            }
            e.target.value = '';
        },
        [handleFiles],
    );

    const isLoading = isUploading || uploadingCount > 0;

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            <div
                tabIndex={0}
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClick();
                }}
                className={cn(
                    'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer',
                    'text-muted-foreground hover:border-emerald-400 hover:bg-emerald-50/50',
                    isDragOver && 'border-primary bg-primary/10 text-primary',
                    disabled && 'pointer-events-none opacity-50',
                    !isDragOver && 'border-gray-300',
                )}
            >
                {isLoading ? (
                    <>
                        <Spinner className="size-8 text-emerald-500" />
                        <p className="text-sm font-medium">Uploading...</p>
                    </>
                ) : (
                    <>
                        {ICON_MAP[fileType]}
                        <div className="text-center">
                            <p className="text-sm font-medium">
                                Drop files here or click to browse
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{LABEL_MAP[fileType]}</p>
                        </div>
                    </>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPT_MAP[fileType]}
                className="hidden"
                onChange={handleInputChange}
                disabled={disabled}
            />
        </div>
    );
}

export { FileDropzone };
export type { DropzoneFile, FileDropzoneProps, FileType };
