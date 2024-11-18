import DriveItem from '../DriveItem/DriveItem';
import SortableItem from '../SortableItem/SortableItem.jsx';
import styles from './DriveSection.module.css';

const DriveSection = ({ title, items, onItemClick, onKebabClick }) => {
  return (
    <div className={styles.driveSection}>
      <span>{title}</span>
      <div className={styles.items}>
        {items.map((item) => (
          <SortableItem key={item._id} id={item._id} isFolder={item.type === 'folder'}>
            <DriveItem
              onItemClick={onItemClick}
              onKebabClick={onKebabClick}
              item={item}
            />
          </SortableItem>
        ))}
      </div>
    </div>
  );
}

export default DriveSection;
