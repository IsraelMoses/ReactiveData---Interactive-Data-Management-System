import React, { useEffect, useState } from "react";
import { getUserTodos, updateData, deleteUserData, getUserPosts, capitalFirstLetter, limitTo50Chars } from "./utils";
import Tasks from "./Tasks";
import Posts from "./Posts";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

const User = ({ user, onDeleteUser, onUpdateUser }) => {
  const [fullName, setFullName] = useState(user.name); // Manages user's Full name
  const [emailAddress, setEmailAddress] = useState(user.email); // Manages user's Email address
  const [todos, setTodos] = useState([]); // Original Tasks/Todos related to the user
  const [posts, setPosts] = useState([]); // Original posts related to the user
  const [showExtraData, setShowExtraData] = useState(false); // Shows User's extra data once the mouse hovers
  const [hoveredLabel, setHoveredLabel] = useState(false); // Shows Todos and Posts once ID <label> area is clicked
  const [todosCompleted, setTodosCompleted] = useState(false); // Checks the current status of entire todo.completed array
  const [isAddTodoClicked, setIsAddTodoClicked] = useState(false); // Checks if the Todo Add button has been clicked
  const [isAddPostClicked, setIsAddPostClicked] = useState(false); // Checks if the Post Add button has been clicked
  const [cancelButtonClick, setCancelButtonClick] = useState(false); // Checks if the Cancel button has been clicked
  const [newPostTitle, setNewPostTitle] = useState(""); // Keeps the current Post title typed by the user
  const [newPostBody, setNewPostBody] = useState(""); // Keeps the current Post body typed by the user
  const [newPosts, setNewPosts] = useState([]); // New Posts typed by the user (using the add button)
  const [newTodos, setNewTodos] = useState([]); // New Todos typed by the user (using the add button)
  const [newTodoTitle, setNewTodoTitle] = useState(""); // Keeps the current Todo title typed by the user
  const [newUserData, setNewUserData] = useState({ street: "", city: "", zipcode: "" }); // New User data typed by the user


// Initializes Todos database and associates it with the user using their ID
useEffect(() => {
    const getTodos = async () => {
      const todos = await getUserTodos(user.id);
      setTodos(todos);
    };
    getTodos();
  }, [user.id]);

// Initializes Posts database and associates it with the user using their ID
useEffect(() => {
    const getPosts = async () => {
      const posts = await getUserPosts(user.id);
      setPosts(posts);
    };
    getPosts();
  }, [user.id]);

// Verifies if all tasks are completed; runs when todos changes ->
// If all tasks are completed: user's main <div> element border turns green, otherwise turns red
useEffect(() => {
    const todosCompleted = todos.map((todo) => todo.completed).every((status) => status);
    setTodosCompleted(todosCompleted);
  }, [todos]);

// Updates user's personal details in the database URL
const handleUpdate = async () => {
    const updatedUser = {
      ...user,
      name: fullName,
      email: emailAddress,
      address: {
        ...user.address,
        street: newUserData.street,
        city: newUserData.city,
        zipcode: newUserData.zipcode,
      },
    };

    try {
      const { data } = await updateData(USERS_URL, user.id, updatedUser);
      console.log('Updated User:', data);

      setFullName(data.name);
      setEmailAddress(data.email);
      setNewUserData({
        street: data.address.street,
        city: data.address.city,
        zipcode: data.address.zipcode,
      });

      onUpdateUser(data);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

// Removes a specific user from the database URL
const handleDelete = async () => {
    try {
      const { data } = await deleteUserData(USERS_URL, user.id);
      onDeleteUser(user.id);
      console.log("User's data Deleted", data);
    } catch (error) {
      console.error("Error Deleting User from DB:", error)
    }
  };

// Marks a todo as completed
const handleIsComplete = async (todoId) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: true };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

// Handles the click event of the Add button

const handleAddButton = async (type) => {
    if (type === "todo") {
      const newTodo = {
        userId: user.id,
        title: newTodoTitle,
        completed: true
      };
      setNewTodos((prevTodos) => [...prevTodos, newTodo]);
      setNewTodoTitle("");
      setCancelButtonClick(false);
    } else if (type === "post") {
      const newPost = {
        userId: user.id,
        title: newPostTitle,
        body: newPostBody,
      };
      setNewPosts((prevPosts) => [...prevPosts, newPost]);
      setNewPostTitle("");
      setNewPostBody("");
      setCancelButtonClick(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          style={{
            border: todosCompleted ? "2px solid green" : "2px solid red",
            marginBottom: "4px",
            padding: "4px",
            textAlign: "left",
            backgroundColor: hoveredLabel ? "#f4a688" : null,
          }}>
          <label
            onClick={() => setHoveredLabel((reverseHovered) => !reverseHovered)}>
            <strong> ID: </strong> {user.id}
          </label>{" "}
          <br /> <br />

          <strong> Name: </strong>
          <input
            style={{ backgroundColor: hoveredLabel ? "#f4a688" : null }}
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)} />
          <br /> <br />

          <strong> Email: </strong>
          <input
            style={{ backgroundColor: hoveredLabel ? "#f4a688" : null }}
            type="text"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)} />
          <br /> <br />

          <div style={{ display: "flex", alignItems: "center" }}>
  <button
    style={{ backgroundColor: "#B1B1B1", marginRight: "65px" }}
    onMouseOver={() => setShowExtraData(true)}
    onClick={() => setShowExtraData(false)}>
    Other Data
  </button>

  <div style={{ flexGrow: 1 }}> 
    <button
      style={{ backgroundColor: "#FFE28B", marginRight: "5px" }}
      onClick={handleUpdate}>
      Update Data
    </button>

    <button
      style={{ backgroundColor: "#FFE28B" }}
      onClick={handleDelete}>
      Delete Data
    </button>
  </div>
</div>



          {showExtraData ? (
            <div style={{
              border: "2px solid black",
              marginTop: "3%",
              padding: "3%"
            }}>
              <strong> Street: </strong>
              <input
                onChange={(e) => setNewUserData((prevData) => ({ ...prevData, street: e.target.value }))} />
              <br />
              <strong> City: </strong>
              <input
                onChange={(e) => setNewUserData((prevData) => ({ ...prevData, city: e.target.value }))} />
              <br />
              <strong> Zip Code: </strong>
              <input
                onChange={(e) => setNewUserData((prevData) => ({ ...prevData, zipcode: e.target.value }))} />
              <br />
            </div>
          ) : null}
        </div>

        <div
          style={{
            marginLeft: "20px",
            display: "inline-block",
            padding: "10px",
            marginBottom: "4px",
            backgroundColor: "white",
            border: hoveredLabel ? "2px solid black" : null,
          }}>

          {hoveredLabel ? (
            <>
              <div
                style={{
                  border: todosCompleted ? "2px solid green" : "2px black",
                  padding: "1%",
                  marginBottom: "3px",
                  visibility: (isAddTodoClicked || isAddPostClicked) && cancelButtonClick ? "hidden" : "visible",
                }}
              >
                <strong style={{ color: "green", marginRight: "67%" }}>
                  {" "}
                  Todos: User {user.id}{" "}
                </strong>
                <button
                  style={{
                    marginTop: "5px",
                    backgroundColor: "#ffec5c",
                    border: "1px solid black",
                    padding: "5px",
                  }}
                  onClick={() => setIsAddTodoClicked(true)}>
                  Add
                </button> <br />
                {todos.map((todo) => (
                  <Tasks
                    key={todo.id}
                    todoId={todo.id}
                    todoTitle={todo.title}
                    isCompleted={todo.completed}
                    completedTitle={capitalFirstLetter(todo.completed.toString())}
                    onMarkCompleted={() => handleIsComplete(todo.id)} />
                ))}
                {newTodos.map((todo, index) => (
                  <Tasks
                    key={`newTodos-${index}`}
                    todoTitle={todo.title}
                    isCompleted={todo.completed}
                    completedTitle={capitalFirstLetter(todo.completed.toString())}
                    onMarkCompleted={() => handleIsComplete(todo.id)} />
                ))}
              </div>

              {isAddTodoClicked ? (
                <>
                  <div style={{ border: "1px solid black", padding: "20px" }}>
                    <strong style={{ marginRight: "3px", color: "#ff66b3" }}>
                      {" "}
                      New Todo - User: {user.id}{" "}
                    </strong> <br /> <br />
                    <strong style={{ margin: "auto," }}> Title: </strong>
                    <input
                      type="text"
                      onChange={(e) => setNewTodoTitle(e.target.value)} />
                    {" "}
                    <strong style={{ margin: "auto," }}> Completed: </strong>
                    <br />
                    <button
                      style={{
                        marginLeft: "63%",
                        marginRight: "10px",
                        backgroundColor: "#ffec5c",
                        border: "1px solid black",
                      }}
                      onClick={() => {
                        setCancelButtonClick(true);
                        setIsAddTodoClicked(false);
                        setIsAddPostClicked(false);
                      }}>
                      Cancel
                    </button>
                    <button
                      style={{
                        backgroundColor: "#ffec5c",
                        border: "1px solid black",
                      }}
                      onClick={() => {
                        handleAddButton("todo");
                        setIsAddTodoClicked(false);
                      }}>
                      {" "}
                      Add{" "}
                    </button>
                  </div>
                </>
              ) : null}

              <div
                style={{
                  border: "3px solid black",
                  padding: "1%",
                  marginTop: "3px",
                  visibility: (isAddTodoClicked || isAddPostClicked) && cancelButtonClick ? "hidden" : "null"
                }}>
                <strong style={{ color: "blue", marginRight: "67%" }}>
                  {" "}
                  Posts: User {user.id}{" "}
                </strong>
                <button
                  style={{
                    marginBottom: "3px",
                    backgroundColor: "#ffec5c",
                    border: "1px solid black",
                    padding: "5px"
                  }}
                  onClick={() => setIsAddPostClicked(true)}>
                  Add
                </button>
                <br />
                {posts.map((post) => (
                  <Posts
                    key={post.id}
                    postTitle={post.title}
                    postBody={limitTo50Chars(post.body)} />
                ))}
                {newPosts.map((post, index) => (
                  <Posts
                    key={`newPost-${index}`}
                    postTitle={post.title}
                    postBody={limitTo50Chars(post.body)} />
                ))}
              </div>

              {isAddPostClicked ? (
                <>
                  <strong style={{ marginRight: "3px", color: "#ff66b3" }}>
                    {" "}
                    New Post - User: {user.id}{" "}
                  </strong>
                  <div style={{ border: "1px solid black", padding: "20px" }}>
                    <strong style={{ margin: "auto," }}> Title: </strong>
                    <input type="text"
                      onChange={(e) => setNewPostTitle(e.target.value)} />
                    {" "}
                    <br /> <br />
                    <strong style={{ margin: "auto," }}> Body: </strong>
                    <input type="text"
                      onChange={(e) => setNewPostBody(e.target.value)} />
                    {" "}
                    <br /> <br />
                    <button
                      style={{
                        marginLeft: "62%",
                        marginRight: "10px",
                        backgroundColor: "#ffec5c",
                        border: "1px solid black",
                      }}
                      onClick={() => {
                        setCancelButtonClick(true);
                        setIsAddTodoClicked(false);
                        setIsAddPostClicked(false);
                      }}>
                      Cancel
                    </button>
                    <button
                      style={{
                        backgroundColor: "#ffec5c",
                        border: "1px solid black",
                      }}
                      onClick={() => {
                        handleAddButton("post");
                        setIsAddPostClicked(false);
                      }} >
                      {" "}
                      Add{" "}
                    </button>
                  </div>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default User;
