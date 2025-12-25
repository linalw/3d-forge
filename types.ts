export enum AppState {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  VIEWER = 'VIEWER',
  ERROR = 'ERROR'
}

export interface GeneratedModel {
  objString: string;
  description: string;
}

export interface ProcessingError {
  message: string;
  details?: string;
}