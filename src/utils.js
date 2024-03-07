import axios from 'axios';
const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos';
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

{/* Bringing every piece of data from the current URL */}
const getAll = (url) => axios.get(`${url}`);


{/* Updates specific obj. */}
const updateData = (url, id, obj) => axios.put(`${url}/${id}`, obj);


{/* Deletes entire User data from the URl. */}
const deleteUserData = (url, userId) => axios.delete(`${url}/${userId}`); 


{/* Bringing a specific user todos - limit to 5 */}
const getUserTodos = async (userId, amount = 5) => {
    const {data: userTodos} = await getAll( `${TODOS_URL}?userId=${userId}&_limit=${amount}`);
    return userTodos;
};


{/* Bringing a specific user Posts - limit to 5 */}
const getUserPosts = async (userId, amount = 5) => {
    const {data: userPosts} = await getAll(`${POSTS_URL}?userId=${userId}&_limit=${amount}`);
    return userPosts;
};


{/* Strings return values related functions */}
const capitalFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};


{/* Limiting the titles of posts and todos to obtain up to 50 chars */}
const limitTo50Chars = (str) => {
    if (str.length <= 50) {
        return str;
    } else {
        return str.substring(0, 50);
    }
}



export {getAll, getUserTodos, updateData, deleteUserData, getUserPosts, capitalFirstLetter, limitTo50Chars};


