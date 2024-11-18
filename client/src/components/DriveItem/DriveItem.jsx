import KebabMenu from '../UI/Kebab/Kebab';
import styles from './DriveItem.module.css';

import { FileIcon, defaultStyles } from 'react-file-icon';

const DriveItem = ({ item, onItemClick, onKebabClick }) => {
  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = (event) => {
    event.stopPropagation();
    onItemClick(item);
  };

  return (
    <div className={styles.item} onClick={handleClick} onContextMenu={handleContextMenu}>
      <div>
        {item.type === 'folder' ? (
          <div className={styles.itemIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="48px"
              height="48px"
            >
              <path fill="var(--primary-color)" opacity="0.7" d="M40,12H22l-4-4H8c-2.2,0-4,1.8-4,4v8h40v-4C44,13.8,42.2,12,40,12z" />
              <path fill="var(--primary-color)" d="M40,12H8c-2.2,0-4,1.8-4,4v20c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V16C44,13.8,42.2,12,40,12z" />
            </svg>
          </div>
        ) : (
          <div className={styles.itemIcon}>
            <FileIcon
              extension={item.ext}
              {...defaultStyles[item.ext]}
            />
          </div>
        )}
      </div>

      <div className={styles.itemData}>
        <div className={styles.marquee}>
          <span>{item.name}</span>
        </div>

        <div className={styles.itemSize}>
          {

            !item.size ? '' :
            item.size && item.size > 1000000000 ? `${(item.size / 1000000000).toFixed(2)}GB` :
            item.size && item.size > 1000000 ? `${(item.size / 1000000).toFixed(2)}MB` :
            item.size && item.size > 1000 ? `${(item.size / 1000).toFixed(2)}KB` : `${item.size}B`
          }
        </div>
      </div>

      <KebabMenu onClick={(event) => onKebabClick(event, item)} />
    </div>
  );
};


export default DriveItem;
