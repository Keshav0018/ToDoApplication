import { generateRandomId } from "./helper.js";

const today = new Date();

export let state = {
  taskList: [],
};

export const addTask = function (data, cat) {
  const id = generateRandomId();

  const task = {
    id: id,
    cat: cat,
    title: data.title,
    description: data.description,
    pirority: data.p,
    deadline: data.time_period || "none",
    done: false,
  };

  state.taskList.push(task);
};

export const editTask = function (id, data) {
  state.taskList.forEach((task) => {
    if (task.id === id) {
      (task.title = data.title),
        (task.description = data.description),
        (task.pirority = data.p),
        (task.deadline = data.time_period || "none");
    }
  });
};

export const store = function () {
  localStorage.clear();
  localStorage.setItem("state", JSON.stringify(state));
};

export const retrive = function () {
  const stateRetrived = localStorage.getItem("state"); // Get string from storage
  if (stateRetrived) {
    return JSON.parse(stateRetrived);
  } else {
    return undefined;
  }
};

export const storeDateMonth = function () {
  const today = new Date();
  state.date = today.getDate();
  state.month = today.getMonth() + 1;
};

export const setState = function (curState) {
  state = curState;
};

export const setStateNewMonth = function (retriveData) {
  state.taskList = retriveData.taskList.filter(
    (task) => task.cat !== "general"
  );
};

export const createQuote = async function () {
  const quote = await fetch("https://dummyjson.com/quotes/random");

  const quoteData = await quote.json();

  return quoteData;
};
