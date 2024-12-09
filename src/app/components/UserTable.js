'use client'
import { useState, useEffect } from 'react'
import useTable from '../hooks/useTable';
import styles from "./UserTable.module.css";
import TableFooter from './TableFooter';
import { MdEdit, MdSave, MdDelete } from 'react-icons/md';

export default function UserTable() {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchCriteria, setSearchCriteria] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([])
    const [editingUserId, setEditingUserId] = useState(null)
    const [rowsPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const { slice, range } = useTable(filteredUsers, page, rowsPerPage)

    //Fetching user data from API
    useEffect(() => {
        async function fetchUsers() {
            let res = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
            let data = await res.json()
            setUsers(data)
        }
        fetchUsers()
    }, [])

    //Filtering user list based on search condition
    useEffect(() => {
        setFilteredUsers(users)
    }, [users])

    //Clearing checkbox selections on page change
    useEffect(() => {
        setSelectedUsers([])
    }, [page])

    //Function to search users based on search criteria
    function searchUser() {
        const filteredData = users.filter((u) => {
            return (
                u.name.toLowerCase().includes(searchCriteria) ||
                u.email.toLowerCase().includes(searchCriteria) ||
                u.role.toLowerCase().includes(searchCriteria)
            )
        })
        setFilteredUsers(filteredData)
    }

    //Function to set search condition on text input change
    function handleSearchCriteriaChange(e) {
        setSearchCriteria(e.target.value.toLowerCase())
    }

    // Function to handle user checkbox toggle for select all
    function handleSelectAllChange(e) {
        if (e.target.checked) {
            // Select all users in the current page
            setSelectedUsers(slice.map(user => user.id));
        } else {
            // Deselect all users in the current page
            setSelectedUsers([]);
        }
    }

    // Function to handle user checkbox toggle
    function handleCheckboxChange(id) {
        setSelectedUsers((prevSelectedUsers) => {
            if (prevSelectedUsers.includes(id)) {
                // If the user is already selected, remove them from the selection
                return prevSelectedUsers.filter(uid => uid !== id)
            } else {
                // Otherwise, add the user to the selected list
                return [...prevSelectedUsers, id]
            }
        });
    }

    // Function to handle user edit button click
    function handleUserEdit(id) {
        if (editingUserId === id) {
            // If the user is already being edited, toggle to save
            setEditingUserId(null)
        } else {
            // Otherwise, set this user as editable
            setEditingUserId(id)
        }
    };

    // Function to handle input changes
    function handleInputChange(e, userId, field) {
        const { value } = e.target
        setUsers(prevUsers => {
            return prevUsers.map(user =>
                user.id === userId ? { ...user, [field]: value } : user // Update the user object
            )
        })
    }

    // Function to handle user deletion button click
    function handleUserDelete(id) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id))
    }

    // Function to handle delete selected users
    function handleDeleteSelected() {
        setUsers(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]); // Clear selection after deletion
    }

    // remove table from display when there is no data
    const disableTable = slice.length === 0

    if (!users) return <div>Loading...</div>


    return (
        <div>
            <h2 className={styles.title}>Admin UI</h2>
            <input type='text' placeholder='Search for a user by name, email or role' onChange={handleSearchCriteriaChange} className={styles.searchInput} />
            <button key='searchButton' className={styles.searchIcon} onClick={searchUser}>Search</button>
            {disableTable ?
                (<p>No data found</p>) : (
                    <>
                        <table className={styles.table}>
                            <thead className={styles.tableRowHeader}>
                                <tr>
                                    <th className={styles.tableHeader}>
                                        <input
                                            type='checkbox'
                                            checked={selectedUsers.length === slice.length && selectedUsers.length !== 0} // If all users are selected, check the "Select All" checkbox
                                            onChange={handleSelectAllChange}
                                        />
                                    </th>
                                    <th className={styles.tableHeader}> Name </th>
                                    <th className={styles.tableHeader}> Email </th>
                                    <th className={styles.tableHeader}> Role </th>
                                    <th colSpan={2} className={styles.tableHeader}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slice.map((user) => {
                                    return (
                                        <tr key={user.id} className={`${styles.tableRowItems} ${selectedUsers.includes(user.id) ? styles.selectedRow : styles.unselectedRow}`}>
                                            <td className={styles.tableCell}><input
                                                type='checkbox'
                                                checked={selectedUsers.includes(user.id)} // Check if the user is selected
                                                onChange={() => handleCheckboxChange(user.id)} // Handle checkbox toggle
                                            />
                                            </td>
                                            <td className={styles.tableCell}><input
                                                className={`${styles.inputField} ${editingUserId === user.id ? styles.activeInput : styles.inactiveInput
                                                    }`}
                                                type='text'
                                                value={user.name}
                                                readOnly={editingUserId !== user.id}
                                                onChange={(e) => handleInputChange(e, user.id, 'name')}
                                            />
                                            </td>
                                            <td className={styles.tableCell}><input
                                                className={`${styles.inputField} ${editingUserId === user.id ? styles.activeInput : styles.inactiveInput
                                                    }`}
                                                type='text'
                                                value={user.email}
                                                readOnly={editingUserId !== user.id}
                                                onChange={(e) => handleInputChange(e, user.id, 'email')}
                                            />
                                            </td>
                                            <td className={styles.tableCell}><input
                                                className={`${styles.inputField} ${editingUserId === user.id ? styles.activeInput : styles.inactiveInput
                                                    }`}
                                                type='text'
                                                style={{ textTransform: 'capitalize' }}
                                                value={user.role}
                                                readOnly={editingUserId !== user.id}
                                                onChange={(e) => handleInputChange(e, user.id, 'role')}
                                            />
                                            </td>
                                            <td className={styles.tableCell}>
                                                <button key='editButton' onClick={() => handleUserEdit(user.id)}  className={styles.icon}>
                                                    {editingUserId === user.id ? 
                                                        <MdSave size={20} color={'green'} /> : 
                                                        <MdEdit size={20} color={'green'} /> }
                                                </button></td>
                                            <td className={styles.tableCell}>
                                                <button key='deleteButton' onClick={() => handleUserDelete(user.id)} className={styles.icon}>
                                                    <MdDelete size={20} color={'red'} /> 
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <div className={styles.tableFooter}>
                            <button onClick={handleDeleteSelected} className={styles.deleteAllBtn}>Delete Selected</button>
                            <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
                        </div>
                    </>
                )}
        </div>
    )
}
