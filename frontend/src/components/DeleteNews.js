import React from 'react';

const DeleteNews = ({ id }) => {
    console.log('DeleteNews id:', id); // Log the id

    const handleDelete = async () => {
        try {
            console.log(`Deleting news with ID: ${id}`); // Log the delete action
            const response = await fetch(`http://localhost:8070/news/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                console.log('News deleted successfully');
                window.location.reload(); // Reload the page after deletion
            } else {
                const errorData = await response.json();
                console.error('Failed to delete news:', errorData.message);
            }
        } catch (err) {
            console.error('Error deleting news:', err);
        }
    };

    return (
        <button onClick={handleDelete}>Delete News</button>
    );
};

export default DeleteNews;
