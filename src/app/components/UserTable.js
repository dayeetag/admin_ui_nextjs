'use client'
import { useState, useEffect } from 'react'
import useTable from '../hooks/useTable';
import styles from "../page.module.css";
import TableFooter from './TableFooter';




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
        if (searchCriteria === "")
            setFilteredUsers(users)
        else {
            const filteredData = users.filter((u) => {
                return (
                    u.name.toLowerCase().includes(searchCriteria) ||
                    u.email.toLowerCase().includes(searchCriteria) ||
                    u.role.toLowerCase().includes(searchCriteria)
                )
            })
            setFilteredUsers(filteredData)
        }
    }, [users, searchCriteria])

    //Clearing checkbox selections on page change
    useEffect(() => {
        setSelectedUsers([])
    }, [page])

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
            <main>
                <h2>Admin UI</h2>
                <input type='text' placeholder='Search for a user by name, email or role' onChange={handleSearchCriteriaChange} />
                {disableTable ?
                    (<p>No data found</p>) : (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <td>
                                            <input
                                                type='checkbox'
                                                checked={selectedUsers.length === slice.length && selectedUsers.length !== 0} // If all users are selected, check the "Select All" checkbox
                                                onChange={handleSelectAllChange}
                                            />
                                        </td>
                                        <td> Name </td>
                                        <td> Email </td>
                                        <td> Role </td>
                                        <td colSpan={2}>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slice.map((user) => {
                                        return (
                                            <tr key={user.id}>
                                                <td><input
                                                    type='checkbox'
                                                    checked={selectedUsers.includes(user.id)} // Check if the user is selected
                                                    onChange={() => handleCheckboxChange(user.id)} // Handle checkbox toggle
                                                />
                                                </td>
                                                <td><input
                                                    type='text'
                                                    value={user.name}
                                                    readOnly={editingUserId !== user.id}
                                                    onChange={(e) => handleInputChange(e, user.id, 'name')}
                                                />
                                                </td>
                                                <td><input
                                                    type='text'
                                                    value={user.email}
                                                    readOnly={editingUserId !== user.id}
                                                    onChange={(e) => handleInputChange(e, user.id, 'email')}
                                                />
                                                </td>
                                                <td><input
                                                    type='text'
                                                    style={{ textTransform: 'capitalize' }}
                                                    value={user.role}
                                                    readOnly={editingUserId !== user.id}
                                                    onChange={(e) => handleInputChange(e, user.id, 'role')}
                                                />
                                                </td>
                                                <td><button key='editButton' onClick={() => handleUserEdit(user.id)}>{editingUserId === user.id ? 'Save' : 'Edit'}</button></td>
                                                <td><button key='deleteButton' onClick={() => handleUserDelete(user.id)}>Delete</button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <button onClick={handleDeleteSelected}>Delete Selected</button>
                                <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
                            </div>
                        </>
                    )}
            </main>
        </div>
    )
}
