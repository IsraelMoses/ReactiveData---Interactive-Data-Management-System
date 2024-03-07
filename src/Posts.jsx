import React from 'react';

const Posts = ({ postTitle, postBody }) => {
    const postStyle = {
        border: "2px solid purple",
        marginBottom: "3px"
    };

    const titleStyle = {
        marginLeft: "4px"
    };

    return (
        <div style={postStyle}>
            <strong style={titleStyle}> Title: </strong> {postTitle} <br />
            <strong style={titleStyle}> Body: </strong> {postBody} <br />
        </div>
    );
};

export default Posts;
