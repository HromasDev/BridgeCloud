import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, children, isFolder, ...props }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: isFolder ? 'none' : CSS.Transform.toString(transform), // Не сдвигаем папку
        transition,
        opacity: isDragging ? 0.5 : 1,
        pointerEvents: isFolder && isDragging ? 'none' : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} {...props}>
            {children}
        </div>
    );
};

export default SortableItem;
