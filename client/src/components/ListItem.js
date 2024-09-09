import { useState } from 'react';
import TickIcon from "./TickIcon";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip from Material UI
import Typography from '@mui/material/Typography'; // Import Typography for better text styling

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options).replace(',', '');
};

const ListItem = ({ task, getData }) => {
  const [showModal, setShowModal] = useState(false);
  
  const deleteItem = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <li className="list-item">
      <div className="info-container">
        <TickIcon />
        <p className='task-title'>{task.title}</p>
        <ProgressBar progress={task.progress} />
      </div>
      <div className="button-container">
        <Tooltip
          title={
            <div style={{
              padding: '10px',
              maxWidth: '300px',
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              <Typography variant="subtitle1" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Created: {formatDate(task.date)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Description: {task.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Progress: {task.progress}%
              </Typography>
            </div>
          }
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }
            }
          }}
        >
          <button className="view">Info</button>
        </Tooltip>
        <button className="edit" onClick={() => setShowModal(true)}>Edit</button>
        <button className="delete" onClick={deleteItem}>Delete</button>
      </div>
      {showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} task={task} />}
    </li>
  );
};

export default ListItem;
