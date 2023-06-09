import { useState, useEffect } from "react";
import useAxios from "../../../utils/useAxios";
import Modal from "./Modal";

function Todo(props) {
  const axiosInstance = useAxios();
  const [viewCompleted, setViewCompleted] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    axiosInstance
      .get("todos/")
      .then((res) => setTodoList(res.data))
      .catch((err) => console.log(err));
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = (item) => {
    toggle();

    if (item.id) {
      axiosInstance
        .put(`todos/${item.id}/`, item)
        .then((res) => refreshList());
      return;
    }
    axiosInstance
      .post("todos/", item)
      .then((res) => refreshList());
  };

  const handleDelete = (item) => {
    axiosInstance
      .delete(`todos/${item.id}/`)
      .then((res) => refreshList());
  };

  const createItem = () => {
    const item = { title: "", description: "", completed: false };

    setActiveItem(item);
    toggle();
  };

  const editItem = (item) => {
    setActiveItem(item);
    toggle();
  };

  const displayCompleted = (status) => {
    setViewCompleted(status);
  };

  const renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => displayCompleted(true)}
          className={viewCompleted ? "nav-link active" : "nav-link"}
        >
          Complete
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={viewCompleted ? "nav-link" : "nav-link active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  const renderItems = ({ todoList, viewCompleted, editItem, handleDelete }) => {
    const newItems = todoList.filter(item => item.completed === viewCompleted);
    return newItems.map(item => {
      return (
        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
          <span
            className={`todo-title mr-2 ${viewCompleted ? 'completed-todo' : ''}`}
            title={item.description}>
            {item.title}
          </span>
          <span>
            <button className="btn btn-secondary mr-2" onClick={() => editItem(item)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => handleDelete(item)}>
              Delete
            </button>
          </span>
        </li>
      )
    });
  };
  ;
  return (
    <main className="container">
      <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="mb-4">
              <button onClick={createItem} className="btn btn-primary my-3">
                Add item
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush border-top-0">
              {renderItems({ todoList, viewCompleted, editItem, handleDelete })}
            </ul>
          </div>
        </div>
      </div>

      {modal ? (
        <Modal
          activeItem={activeItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      ) : null}
    </main>
  );
}

export default Todo;
