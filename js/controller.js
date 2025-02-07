import ViewForm from "./View/ViewForm.js";

import * as model from "./model.js";

import { checkTime } from "./helper.js";

const controlAddForm = function (category) {
  ViewForm.render(category, controlSubmitForm, controlCancel);
};

const controlSubmitForm = function (cat, data, id = "", el = "") {
  console.log(data);

  // Error handling
  if (data.title === "") {
    ViewForm.renderError(
      ` <p class="error-message"><ion-icon name="warning-outline" class="error-icon"></ion-icon>Please enter the title </p>`,
      cat,
      controlSubmitForm,
      controlCancel,
      data,
      id,
      el
    );
    return;
  }

  if (data.time_period != "none" && checkTime(data.time_period)) {
    ViewForm.renderError(
      `<p class="error-message"><ion-icon name="warning-outline" class="error-icon"></ion-icon> Please select appropiate time</p> `,
      cat,
      controlSubmitForm,
      controlCancel,
      data,
      id,
      el
    );

    return;
  }

  if (id === "") {
    model.addTask(data, cat);
  } else {
    model.editTask(id, data);
  }
  let cur;

  if (id === "") cur = "";
  else cur = "edit";

  ViewForm.renderTask(
    model.state.taskList,
    controlCheckListTask,
    controlDeleteTask,
    controlEditForm,
    cat,
    cur
  );

  ViewForm.renderTaskDone(model.state.taskList);

  model.storeDateMonth();
  model.store();
};

const controlCancel = function () {
  ViewForm.renderTask(
    model.state.taskList,
    controlCheckListTask,
    controlDeleteTask,
    controlEditForm,
    "",
    "edit"
  );
};

const controlDeleteTask = function (id) {
  const indexToBeDeleted = model.state.taskList.findIndex(
    (task) => task.id === id
  );

  model.state.taskList.splice(indexToBeDeleted, 1);

  ViewForm.renderTaskDone(model.state.taskList);

  ViewForm.renderTask(
    model.state.taskList,
    controlCheckListTask,
    controlDeleteTask,
    controlEditForm
  );

  model.storeDateMonth();
  model.store();
};

const controlEditForm = function (id, el) {
  model.state.taskList.forEach((task) => {
    if (task.id === id) {
      const temp = task;
      const cat = temp.cat;
      ViewForm.render(cat, controlSubmitForm, controlCancel, el, temp);
    }
  });
};

const controlCheckListTask = function (id) {
  // Make the task done to true
  model.state.taskList.forEach((task) => {
    if (task.id === id) {
      task.done = true;
    }
  });

  // Render done task

  const allTaskDone = model.state.taskList.every((task) => task.done);

  ViewForm.renderTaskDone(model.state.taskList);

  // render task again
  ViewForm.renderTask(
    model.state.taskList,
    controlCheckListTask,
    controlDeleteTask,
    controlEditForm
  );

  model.storeDateMonth();
};

// geting this retrive data and modifiying acording to user then setting it to state and then displaying state
let retriveData;

// on LOAD IF STATE EXIST IN LOCAL STORAGE THEN STATE  = NEW STATE
window.addEventListener("load", async function () {
  retriveData = model.retrive();

  if (retriveData === undefined) {
    ViewForm.renderCurDate();
    ViewForm.addHandler(controlAddForm);
    ViewForm.renderTaskDone(model.state.taskList, []);

    const quote = await model.createQuote();
    model.state.quote = quote;
    model.storeDateMonth();

    ViewForm.renderQuote(model.state.quote);

    model.store();
    return;
  }

  const dailyTaskNotDone = retriveData.taskList.filter(
    (task) => task.cat === "daily" && task.done === false
  );

  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;

  // Checking if month is changed
  if (retriveData.month !== month && retriveData.month !== undefined) {
    console.log("siuu");
    retriveData.taskList = retriveData.taskList.filter(
      (task) => task.cat !== "general"
    );
    console.log(retriveData);
    model.setState(retriveData);
  }

  // Checking if day is changed

  if (retriveData.date !== date) {
    const newQuote = await model.createQuote();
    retriveData.quote = newQuote;
  }

  if (
    retriveData.date !== date &&
    retriveData.date !== undefined &&
    dailyTaskNotDone.length > 0
  ) {
    // Means a new day
    // so first a modal window to ask whether he want previous undone task

    ViewForm.renderModel();
  } else {
    model.setState(retriveData);
  }

  const allTaskDone = model.state.taskList.every((task) => task.done);
  ViewForm.addHandler(controlAddForm);
  ViewForm.renderTask(
    model.state.taskList,
    controlCheckListTask,
    controlDeleteTask,
    controlEditForm
  );
  ViewForm.renderTaskDone(model.state.taskList, allTaskDone);
  ViewForm.renderCurDate();
  ViewForm.renderQuote(retriveData.quote);
});

document.querySelector(".btn-yes").addEventListener("click", function (e) {
  e.preventDefault();

  retriveData.taskList = retriveData.taskList.filter(
    (task) =>
      (task.cat === "daily" && task.done == false) || task.cat === "general"
  );
  model.setState(retriveData);

  const allTaskDone = model.state.taskList.every((task) => task.done);

  ViewForm.addHandler(controlAddForm);
  ViewForm.renderTask(
    model.state.taskList,
    controlCheckListTask,
    controlDeleteTask,
    controlEditForm
  );
  ViewForm.renderTaskDone(model.state.taskList, allTaskDone);
  model.store();
  ViewForm.removeModel();
});

document.querySelector(".btn-no").addEventListener("click", function (e) {
  e.preventDefault();

  retriveData.taskList = retriveData.taskList.filter(
    (task) => task.cat === "general"
  );

  model.setState(retriveData);

  const allTaskDone = model.state.taskList.every((task) => task.done);

  ViewForm.renderTask(
    model.state.taskList,
    controlCheckListTask,
    controlDeleteTask,
    controlEditForm
  );
  ViewForm.addHandler(controlAddForm);
  ViewForm.renderTaskDone(model.state.taskList, allTaskDone);
  model.store();
  ViewForm.removeModel();
});

// on exit and reloat i want to store the data .
window.addEventListener("unload", function (e) {
  model.store();
});

window.addEventListener("beforeunload", function (event) {
  model.store();
});
