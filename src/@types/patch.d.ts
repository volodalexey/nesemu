// Patches for type declarations.

interface Window {
  webkitAudioContext: any

  showOpenFilePicker(option?: any): Promise<[FileSystemFileHandle]>
  showSaveFilePicker(option?: any): Promise<FileSystemFileHandle>

  app: any
  $DEBUG: boolean
}

interface FileSystemHandle {
  readonly kind: 'file' | 'directory'
  readonly name: string
}

interface FileSystemFileHandle extends FileSystemHandle {
  getFile(): Promise<File>
  createWritable(): Promise<FileSystemWritableFileStream>
}

interface WritableStream {
  close(): any
}

interface FileSystemWritableFileStream extends WritableStream {
  write(content: any): Promise<undefined>
}

interface CanvasRenderingContext2D {
  roundRect(x: number, y: number, width: number, height: number, radii: number): void
}
