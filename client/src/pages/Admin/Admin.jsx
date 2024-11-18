import { faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";
import { getUsers, setUsers } from "../../actions/admin";
import Section from "../../components/Section/Section";
import SideBar from "../../components/SideBar/SideBar";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import styles from "./Admin.module.css";

const Admin = () => {
    const [usersList, setUsersList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [initialUsers, setInitialUsers] = useState([]);
    const [searchColumn, setSearchColumn] = useState('_id');
    const [searchValue, setSearchValue] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // Порядок сортировки: asc/desc
    const [changed, setChanged] = useState(false);

    const formatDate = (date) => {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };

        const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(new Date(date));
        return formattedDate;
    };

    useEffect(() => {
        const getUsersHandler = async () => {
            const fetchedUsers = await getUsers();
            setUsersList(fetchedUsers);
            setFilteredUsers(fetchedUsers);
            setInitialUsers(fetchedUsers);
        };
        getUsersHandler();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchValue(query);

        const result = query.length > 0 ? usersList.filter(user => {
            const columnValue = String(user[searchColumn]);
            return columnValue.toLowerCase().includes(query.toLowerCase());
        }) : usersList;

        setFilteredUsers(result);
    };

    const dateSort = () => {
        const sorted = [...filteredUsers].sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setFilteredUsers(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleRoleChange = (userId) => {
        const updatedUsers = usersList.map(user =>
            user._id === userId ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' } : user
        );

        setUsersList(updatedUsers);
        setFilteredUsers(updatedUsers);

        // Проверяем, были ли изменения в ролях
        const isChanged = updatedUsers.some((user, index) => user.role !== initialUsers[index].role);

        setChanged(isChanged); // Если есть изменения, устанавливаем true, иначе false
    };

    const isCellModified = (user, column) => {
        return user[column] !== initialUsers.find(u => u._id === user._id)[column];
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        const updatedUsers = await setUsers(usersList);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setInitialUsers(updatedUsers);

        setChanged(false);
    }

    return (
        <div>
            <SideBar />
            <div className={`content ${styles.Admin}`}>
                <h2 className="title">Админ-панель</h2>
                <Section title="Управление пользователями">
                    <Input
                        id="search"
                        type="text"
                        value={searchValue}
                        onChange={handleSearch}
                        placeholder={`Поиск по ${searchColumn.toUpperCase()}`}
                    />
                    <div className={styles.tableSection}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th onClick={() => setSearchColumn('_id')}>ID</th>
                                    <th onClick={() => setSearchColumn('vk_id')}>VK ID</th>
                                    <th onClick={() => setSearchColumn('name')}>Имя</th>
                                    <th onClick={() => setSearchColumn('login')}>Логин</th>
                                    <th onClick={() => setSearchColumn('role')}>Роль</th>
                                    <th onClick={dateSort}>
                                        Дата регистрации <FontAwesomeIcon icon={faSort} className="sort-icon" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user._id}>
                                            <td className={isCellModified(user, '_id') ? styles.modified : ''}>{user._id}</td>
                                        <td className={isCellModified(user, 'vk_id') ? styles.modified : ''}>{user.vk_id || '-'}</td>
                                        <td className={isCellModified(user, 'name') ? styles.modified : ''}>{user.name} </td>
                                            <td className={isCellModified(user, 'login') ? styles.modified : ''}>{user.login}</td>
                                        <td
                                            className={`${isCellModified(user, 'role') ? styles.modified : ''}`}
                                            onClick={() => handleRoleChange(user._id)}
                                        >
                                            {user.role}
                                        </td>
                                        <td className={isCellModified(user, 'created_at') ? styles.modified : ''}>
                                            {formatDate(user.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {changed && <Button onClick={handleSaveChanges}>СОХРАНИТЬ ИЗМЕНЕНИЯ</Button>}
                </Section>
            </div>
        </div>
    );
};

export default Admin;
