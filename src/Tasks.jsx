import { useState, useEffect } from "react";
import { updateData } from "./utils";

const Tasks = ({todoId ,todoTitle, completedTitle, isCompleted, onMarkCompleted  }) => {

  const TODOS_URL = "https://jsonplaceholder.typicode.com/todos";

  const [updatedCompletedTitle, setUpdatedCompletedTitle] = useState(completedTitle);

  useEffect(() => {
    setUpdatedCompletedTitle(completedTitle);
  }, [completedTitle]);

  const updateTodosData = async () => {
    const updatedTodo = { title: todoTitle, completed: true };
    try {
      const {data} = await updateData(TODOS_URL, todoId, updatedTodo);
      console.log("Update Data:", data);
      setUpdatedCompletedTitle('True');
      onMarkCompleted();
    } catch (error) {
      console.error("Error updating todo data:", error);
    }
  };


  return (
    <div style={{border:"2px solid purple", marginBottom:"3px", textAlign:"left", paddingBottom:"3px" }}>
     <strong style={{marginLeft: "4px"}}> Title: </strong> {todoTitle} <br />
     <strong style={{marginLeft: "4px"}}> completed: </strong> {updatedCompletedTitle} 
     {!isCompleted && (
      <button 
        onClick={updateTodosData}
        style={{marginLeft:"70%",
                padding: "5px", 
                border: "1px solid Black",
                backgroundColor:"#FFE28B"}}>
                Mark Completed 
      </button>      
     )}
    </div>
  )
}
export default Tasks
