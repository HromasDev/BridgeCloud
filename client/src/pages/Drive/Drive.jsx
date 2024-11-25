import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFiles, getFiles, uploadFiles, createFile, rename, moveFiles } from '../../actions/file';
import { setCurrentFolderId, setCurrentPath } from '../../redux/storageSlice';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import DriveSection from "../../components/DriveSection/DriveSection";
import SideBar from "../../components/SideBar/SideBar";
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import Modal from "../../components/Modal/Modal";
import styles from './Drive.module.css';
import FileEditor from "../../components/FileEditor/FileEditor.jsx";
import Dropzone from "../../components/Dropzone/Dropzone.jsx";

const CONTEXT_MENU_ID = 'CONTEXT_MENU';
const KEBAB_MENU_ID = 'KEBAB_MENU';

const Drive = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [kebabItem, setKebabItem] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [isEditing, setIsEditing] = useState(null)

  const { files, progress, isLoading, folders, currentPath, currentFolderId } = useSelector(state => state.storage);
  const [currentStorage, setCurrentStorage] = useState({
    files: [],
    folders: []
  });

  useEffect(() => {
    setCurrentStorage({
      files: files.filter(file => file.folder === currentFolderId),
      folders: folders.filter(folder => folder.folder === currentFolderId)
    });
  }, [files, folders, currentFolderId]);


  const handleDrop = (acceptedFiles) => {
    uploadFiles(dispatch, acceptedFiles, currentFolderId);
  };

  const handleFileSelection = (event) => {
    const selectedFiles = Array.from(event.target.files);
    handleDrop(selectedFiles);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      await getFiles(dispatch);
    };
    fetchFiles();
  }, [dispatch]);

  const handleFolderClick = (folder) => {
    setIsEditing(null); // Очищаем состояние редактирования при переходе в другую папку
    if (folder && folder._id) {
      dispatch(setCurrentFolderId(folder._id));
      dispatch(setCurrentPath([...currentPath, { id: folder._id, name: folder.name }]));
    } else {
      console.error('Folder ID is undefined or invalid');
    }
  };

  const handleFileClick = (file) => {
    // Проверяем, открыт ли уже этот файл
    if (file && file._id) {
      if (isEditing && isEditing._id === file._id) {
        return;
      }
      // Открываем новый файл для редактирования
      setIsEditing(file);

      dispatch(setCurrentPath([...currentPath, { id: file._id, name: file.name }]));
    } else {
      console.error('File ID is undefined or invalid');
    }
  };


  const handlePathClick = (index) => {
    const clickedPathItem = currentPath[index];

    // Проверяем, если текущий файл уже открыт
    if (isEditing && clickedPathItem.id === isEditing._id) {
      return;
    }

    setIsEditing(null);
    const newPath = currentPath.slice(0, index + 1);
    const newFolderId = clickedPathItem.id; // Получаем новый ID папки/файла

    dispatch(setCurrentPath(newPath));
    dispatch(setCurrentFolderId(newFolderId));
  };

  const { show: showContextMenu } = useContextMenu({ id: CONTEXT_MENU_ID });

  const handleContextMenu = (event) => {
    event.preventDefault();
    showContextMenu({ event });
  };

  const handleItemClick = async ({ id }) => {
    switch (id) {
      case 'download':
        kebabItem.url && window.open(kebabItem.url, '_blank');
        break;
      case 'upload':
        fileInputRef.current.click();
        break;
      case 'delete':
        await deleteFiles(dispatch, { files: [kebabItem] });
        break;
      case 'create-folder':
        setModalData({
          header: 'Создать папку',
          placeholder: 'Название Папки',
          onSubmit: (name) => {
            if (name) {
              createFile(dispatch, name, 'folder', currentFolderId);
            }
            setModalData(null);
          },
        });
        break;
      case 'create-file':
        setModalData({
          header: 'Создать файл',
          placeholder: 'Название Файла',
          onSubmit: (name) => {
            if (name) {
              createFile(dispatch, name, 'file', currentFolderId);
            }
            setModalData(null);
          },
        });
        break;
      case 'rename':
        setModalData({
          header: 'Переименовать',
          placeholder: `Название ${kebabItem.type === 'folder' ? 'Папки' : 'Файла'}`,
          value: kebabItem.name,
          onSubmit: (name) => {
            if (name) {
              rename(dispatch, { file_id: kebabItem._id, file_name: name, type: kebabItem.type });
            }
            setModalData(null);
          },
        });
        break;
      default:
        break;
    }
  };

  const handleKebabClick = (event, item) => {
    event.stopPropagation();
    showContextMenu({ event, id: KEBAB_MENU_ID });
    setKebabItem(item);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id && over.id && active.id !== over.id) {
      const draggedFile = files.find(file => file._id === active.id);
      const targetFolder = folders.find(folder => folder._id === over.id);

      if (draggedFile && targetFolder) {
        moveFiles(dispatch, {
          files: [draggedFile._id], // Отправляем массив идентификаторов файлов
          folder: targetFolder._id   // Отправляем идентификатор папки
        });

        console.log(`Moved file: ${draggedFile.name} to folder: ${targetFolder.name}`);
      }
    }
  };



  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SideBar />

      {modalData && (
        <Modal
          modal={modalData}
        />
      )}

      <div className="content" onContextMenu={handleContextMenu}>
        <div className="title">
          {currentPath.map((item, index) => (
            <div key={index} className={styles.pathSection}>
              <span className={styles.pathFolder} onClick={() => handlePathClick(index)}>
                {item.name}
              </span>
              {index < currentPath.length - 1 && <span className={styles.pathSlash}> {'>'} </span>}
            </div>
          ))}
        </div>


        {isEditing ? (
          <FileEditor
            dispatch={dispatch}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setCurrentPath={setCurrentPath}
            currentPath={currentPath}
          />
        ) : (
          <SortableContext
            items={[...currentStorage.folders.map(folder => folder._id), ...currentStorage.files.map(file => file._id)]}
            strategy={rectSortingStrategy}
          >
            {currentStorage.folders.length > 0 && (
              <DriveSection
                title="Папки"
                items={currentStorage.folders}
                onItemClick={handleFolderClick}
                onKebabClick={handleKebabClick}
              />
            )}
            {currentStorage.files.length > 0 && (
              <DriveSection
                title="Файлы"
                items={currentStorage.files}
                onItemClick={handleFileClick}
                currentFolderId={currentFolderId}
                onKebabClick={handleKebabClick}
              />
            )}
            <Dropzone onDrop={handleDrop} />
          </SortableContext>


        )}

        <Menu id={CONTEXT_MENU_ID}>
          <Item id="upload" onClick={handleItemClick}>Загрузить</Item>
          <Item id="create-folder" onClick={handleItemClick}>Создать папку</Item>
          <Item id="create-file" onClick={handleItemClick}>Создать файл</Item>
        </Menu>

        <Menu id={KEBAB_MENU_ID}>
          <Item id="download" onClick={handleItemClick}>Скачать</Item>
          <Item id="rename" onClick={handleItemClick}>Переименовать</Item>
          <Item id="delete" onClick={handleItemClick}>Удалить</Item>
        </Menu>

        {isLoading && (
          <div className={styles.progressWrapper}>
            <div className={styles.progressWrapperContent}>
                {progress.map((item, index) => (
                <div key={index} className={styles.progressFile}>
                    <span>{item.name}: {item.progress}%</span>
                    <div className={styles.progress} style={{ width: `${item.progress}%` }}></div>
                </div>
            ))}
            </div>
          </div>
        )}

        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelection}
        />


      </div>
    </DndContext>
  );
};

export default Drive;
