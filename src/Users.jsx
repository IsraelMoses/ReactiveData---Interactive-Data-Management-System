import React, { useState, useEffect } from 'react';
import './App.css';
import { getAll, updateData } from './utils';
import User from './User';

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data: usersData } = await getAll(USERS_URL);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const isClickedHandler = () => {
    setIsClicked(!isClicked);
  };

  const addUserHandler = () => {
    const newUser = {
      id: users.length + 1,
      name: newUserName,
      email: newUserEmail
    };
    setUsers([...users, newUser]);
    setNewUserName("");
    setNewUserEmail("");
    setIsClicked(false);
    console.log(`User added successfully: ${JSON.stringify(newUser)}`);
    console.log("Updated Users Array:", users);
  };

  const deleteUserHandler = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const updateUserDate = async (updatedUser) => {
    try {
      const { data } = await updateData(USERS_URL, updatedUser.id, updatedUser);
      console.log("Update Data:", data);
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === updatedUser.id ? updatedUser : user))
      );
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
<div style={{ display: "flex", justifyContent: "space-between", border: "1px solid black", borderRadius: "40px", paddingLeft: "40px" }}>

<div style={{ textAlign: "left" }}>
          <strong> Search: </strong>
          <input
            style={{ marginRight: "8%" }}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button style={{ backgroundColor: "#f4c688", marginBottom: "5px" }} onClick={isClickedHandler}>
            Add
          </button>
          {filteredUsers.map((user) => (
            <User key={user.id} user={user} onDeleteUser={deleteUserHandler} onUpdateUser={updateUserDate} />
          ))}
        </div>
        {isClicked ? (
          <div style={{ textAlign: "left", padding: "3%" }}>
            Add New User
            <div style={{
              border: "2px solid black",
              padding: "5px",
              marginTop: "8%",
              height: "150px",
              width: "300px",
              textAlign: "left"
            }}>
              <strong> Name: </strong>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
              <br /> <br />
              <strong> Email: </strong>
              <input
                type="text"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
              <br />
              <button style={{
                marginLeft: "40%",
                marginRight: "5%",
                marginTop: "10%",
                backgroundColor: "#f4c688"
              }} onClick={addUserHandler}>
                Add
              </button>
              <button style={{
                backgroundColor: "#f4c688"
              }} onClick={isClickedHandler}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Users;

