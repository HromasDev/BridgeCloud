import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: [],
  folders: [],
  currentFolderId: 'ROOT',
  currentPath: [{ id: 'ROOT', name: 'Мой диск' }], // Инициализация текущего пути
  progress: [],
  isCreating: false,
  isLoading: false,
  error: null,
};


const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    addFile: (state, action) => {
      state.files.push(action.payload);
    },
    removeFile: (state, action) => {
      state.files = state.files.filter(file => file._id !== action.payload);
    },
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    removeFolder: (state, action) => {
      state.folders = state.folders.filter(folder => folder._id !== action.payload);
    },
    renameFile: (state, action) => {
      const file = state.files.find(file => file._id === action.payload._id);
      if (file) {
        file.name = action.payload.name;
        file.ext = action.payload.ext;
      }
    },
    renameFolder: (state, action) => {
      const folder = state.folders.find(folder => folder._id === action.payload._id);
      if (folder) {
        folder.name = action.payload.name;
      }
    },
    moveFile: (state, action) => {
      const { _id, folderId } = action.payload;
      const file = state.files.find(file => file._id === _id);
      if (file) {
        file.folder = folderId;
      }
    },

    setFiles: (state, action) => {
      state.files = action.payload
    },
    setFolders: (state, action) => {
      state.folders = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCreating: (state, action) => {
      state.isCreating = action.payload;
    },
    setProgress: (state, action) => {
      state.progress[action.payload.index] = action.payload;
    },
    clearProgress: (state) => {
      state.progress = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCurrentFolderId: (state, action) => {
      state.currentFolderId = action.payload;
    },
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload;
    },
    updateFileData: (state, action) => {
      const file = state.files.find(file => file.document_id === action.payload.old_data.document_id);
      if (file) {
        file.document_id = action.payload.new_data.document_id;
        file.url = action.payload.new_data.url;
        file.size = action.payload.new_data.size;
      }
    },

  },
});

export const {
  addFile, updateFileData, removeFile, moveFile, addFolder, removeFolder, setFiles, setFolders,
  setLoading, setProgress, clearProgress, setError, setCreating,
  setCurrentFolderId, setCurrentPath, renameFile, renameFolder
} = storageSlice.actions;
export default storageSlice.reducer;
