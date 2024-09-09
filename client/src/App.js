import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For search filtering
  const [sortMethod, setSortMethod] = useState("date"); // Sorting method

  const getData = async () => {
    if (!authToken) return; // No need to fetch if not authenticated

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, [authToken]); // Re-fetch data when authToken changes

  // Function to handle sorting based on the selected sort method
  const sortTasks = (tasks) => {
    if (!tasks) return [];

    return tasks.sort((a, b) => {
      if (sortMethod === "date") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortMethod === "progress") {
        return a.progress - b.progress;
      }
      return 0;
    });
  };

  // Filter tasks based on search term and then sort
  const filteredAndSortedTasks = sortTasks(
    tasks.filter((task) =>
      task.title ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
  );

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listName={"🎯 To-Do List"} getData={getData} />
          <p className="user-email">Welcome Back....! {userEmail}</p>

          <div className="filter-container">
            {/* Search bar input */}
            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            {/* Sort options */}
            <div className="sort-options">
              <label className="sort-label">Sort by:</label>
              <select
                value={sortMethod}
                onChange={(e) => setSortMethod(e.target.value)}
                className="sort-select"
              >
                <option value="date">Date</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>

          {/* Render the filtered and sorted task list */}
          {filteredAndSortedTasks.length > 0 ? (
            filteredAndSortedTasks.map((task) => (
              <ListItem key={task.id} task={task} getData={getData} />
            ))
          ) : (
            <p>No tasks available</p> // Graceful handling when there are no tasks
          )}
        </>
      )}
    </div>
  );
};

export default App;
