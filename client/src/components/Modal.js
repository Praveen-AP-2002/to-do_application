import { useState } from "react";
import { useCookies } from "react-cookie";

const Modal = ({ mode, setShowModal, getData, task, ...props }) => {
  const [cookies] = useCookies(null);
  const editMode = mode === "edit";

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : "",
    progress: editMode ? task.progress : 0,
    description: editMode ? task.description : "",
    date: editMode ? task.date : new Date(),
  });

  // Check if the title is filled to enable/disable submit button
  const isFormValid = data.title.trim() !== "";

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>
        <form>
          <input
            required
            placeholder="Your task title goes here"
            name="title"
            value={data.title || ""}
            onChange={handleChange}
            className="task-title-input"
          />
          <br />
          <textarea
            required
            placeholder="Add a description"
            name="description"
            value={data.description || ""}
            onChange={handleChange}
            className="description-textarea"
          />
          <br />
          {editMode && (
            <>
              <label htmlFor="range">Drag to Select your current progress</label>
              <input
                required
                type="range"
                id="range"
                min="0"
                max="100"
                name="progress"
                value={data.progress || 0}
                onChange={handleChange}
                className="progress-range"
              />
              <br />
            </>
          )}
          <input
            className={mode}
            type="submit"
            onClick={editMode ? editData : postData}
            disabled={!isFormValid} // Disable button if title is empty
          />
        </form>
      </div>
    </div>
  );
};

export default Modal;
