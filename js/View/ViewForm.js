class ViewForm {
  renderModel() {
    document.querySelector(".modal-overlay").style.display = "block";
    document.querySelector(".modal-window").style.display = "block";
  }

  removeModel() {
    document.querySelector(".modal-overlay").style.display = "none";
    document.querySelector(".modal-window").style.display = "none";
  }

  render(category, submitHandler, cancelHnadler, el = "", data = "") {
    console.log(category);
    console.log(data);
    const html = this._generateMarkup("form", category);

    const neighbour = document.querySelector(
      `.container-grid-task-done-${category}`
    );
    if (el === "" && data === "") {
      //  // Sending the task completed container down

      neighbour.insertAdjacentHTML("beforebegin", html);

      // Adding animation to make it smooth entry of form;
      const formInserted = document.querySelector(".add-task-form");

      let height = formInserted.offsetHeight;
      gsap.set(neighbour, { y: -height });

      gsap.to(neighbour, { y: 0, duration: 0.25, ease: "power2.out" });

      gsap.from(formInserted, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else if (el !== "") {
      el.insertAdjacentHTML("beforebegin", html);
      const formInsertedEdited = document.querySelector(".add-task-form");
      formInsertedEdited.style.opacity = 0;
      gsap.to(formInsertedEdited, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });
      this._addDataToForm(data);
    }

    if (data !== "" && el === "") {
      neighbour.insertAdjacentHTML("beforebegin", html);
      this._addDataToForm(data);
    }

    const addFormbtns = [...document.querySelectorAll(`.btn-add-task`)];

    addFormbtns.forEach((btn) => {
      btn.style.display = "none";
    });

    const submitBtn = document.querySelector(".btn-add-task-form");

    const submitFunction = function (e) {
      e.preventDefault();
      const dataArr = [
        ...new FormData(document.querySelector(".add-task-form")),
      ];

      const dataEntered = Object.fromEntries(dataArr);

      submitHandler(category, dataEntered, data.id, el);
    };

    submitBtn.addEventListener("click", submitFunction);

    document.querySelectorAll("input").forEach((input) => {
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          submitFunction(event);
        }
      });
    });

    // document
    //   .querySelector(".add-task-form")
    //   .addEventListener("keydown", function (event) {
    //     if (event.key === "Enter") {
    //       event.preventDefault(); // Prevent accidental multiple submits
    //       submitFunction(event);
    //     }
    //   });

    if (document.getElementById("deadline-option")) {
      const input = document.getElementById("deadline-option");

      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          submitFunction(event);
        }
      });
    }

    const cancelBtn = document.querySelector(".btn-cancel-form");

    cancelBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("siuu");
      cancelHnadler();
    });

    document.querySelector(".add-task-form").scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center", // Optionally, centers it horizontally (if needed)
    });

    document.querySelectorAll(".text-input").forEach((input) => {
      input.addEventListener("focus", (event) => {
        setTimeout(() => {
          event.target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300); // Delay to wait for keyboard animation
      });
    });

    setTimeout(() => {}, 300); // Delay to wait for keyboard animation
  }

  _addDataToForm(data) {
    const form = document.querySelector(".add-task-form");
    for (const key in data) {
      const field = form.querySelector(`[name="${key}"]`); // Match by `name` attribute
      if (field) {
        field.value = data[key];
      }
    }

    if (data.cat !== "general") {
      const select = document.getElementById("deadline-option");

      Array.from(select.options).forEach((option) => {
        if (option.value === data.deadline) {
          option.selected = true;
        }
      });
    }

    document.getElementById(data.pirority).checked = true;
  }

  addHandler(handler) {
    const addFormBtns = [...document.querySelectorAll(".btn-add-task")];

    addFormBtns.forEach((btn) =>
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        handler(`${btn.dataset.cat}`);
      })
    );
  }

  renderTask(
    taskArr,
    toDoBtnHandler,
    deleteBtnHandler,
    editBtnHandler,
    cat = "",
    cur = ""
  ) {
    // Form delete

    const form = document.querySelector(".add-task-form");

    // Fading out the form before it gets removed

    if (cur !== "edit") {
      form ? gsap.to(form, { opacity: 0, scale: 0.75, duration: 0.2 }) : "";
      let container;
      if (cat !== "") {
        container = document.querySelector(`.container-grid-task-done-${cat}`);
      }

      // Disable scrolling

      let height = form?.offsetHeight;

      gsap.to(container, {
        y: -height * 0.7,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          if (form) form.remove(); // Remove the element after animation is complete
        },
      });

      setTimeout(function () {
        if (form) {
          gsap.to(container, { y: 0, duration: 0.000001, ease: "power2.out" });

          const addFormbtns = [...document.querySelectorAll(`.btn-add-task`)];

          addFormbtns.forEach((btn) => {
            gsap.set(btn, { opacity: 0 });
            btn.style.display = "block";
            gsap.to(btn, { opacity: 1, scale: 1, duration: 0.5 });
          });
        }
      }, 500);
    } else {
      form.remove();
      const addFormbtns = [...document.querySelectorAll(`.btn-add-task`)];
      addFormbtns.forEach((btn) => {
        btn.style.display = "block";
      });
    }

    // Re rendering the add task btn

    // creating genral task

    const generalTasks = taskArr.filter(
      (task) => task.cat === "general" && task.done === false
    );

    const htmlGeneralTask = generalTasks
      .map((task) => {
        return this._generateMarkupTask(task);
      })
      .join("");

    // Removing all prevuious task
    [...document.querySelectorAll(".task")].forEach((task) => task.remove());

    // Adding general Task to the container

    document
      .querySelector(".task-container--general")
      .insertAdjacentHTML("afterbegin", htmlGeneralTask);

    // creating genral task

    const dailyTasks = taskArr.filter(
      (task) => task.cat === "daily" && task.done === false
    );

    const htmlDailyTask = dailyTasks
      .map((task) => {
        return this._generateMarkupTask(task);
      })
      .join("");

    // Adding daily Task to the container

    document
      .querySelector(".task-container--daily-task")
      .insertAdjacentHTML("afterbegin", htmlDailyTask);

    if (cur !== "edit") {
      let lastElement = [];

      if (cat === "daily") {
        lastElement =
          document.querySelectorAll(`.task-container--${cat}-task .task`) || [];
      } else if (cat == "general") {
        lastElement =
          document.querySelectorAll(".task-container--general .task") || [];
      }

      let lastItem = lastElement[lastElement.length - 1];
      if (cat) {
        lastItem.style.opacity = 0;
        lastItem.style.transform = "scale(0.3)";
      }

      console.log(lastItem);

      if (cat !== "") {
        gsap.to(lastItem, {
          opacity: 1, // Start with opacity 0 (invisible)
          scale: 1, // Start at half the size
          duration: 0.02, // Duration of the animation (1 second)
          ease: "bounce.out", // Apply the bounce effect
        });
      }
    }
    [...document.querySelectorAll(".to-do-radio-btn")].forEach((toDoBtn) =>
      toDoBtn.addEventListener(
        "click",
        function () {
          const task = toDoBtn.parentElement;
          this.playSound();
          const nextTask = task.nextElementSibling;
          gsap.to(task, {
            rotationY: 180,
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
          });
          setTimeout(() => {
            toDoBtnHandler(task.dataset.id);
          }, 500);
        }.bind(this)
      )
    );

    [...document.querySelectorAll(".btn-delete")].forEach((deleteBtn) =>
      deleteBtn.addEventListener("click", function () {
        const task = deleteBtn.closest(".task");
        console.log(task);

        gsap.to(task, {
          scale: 1.2,
          opacity: 0,
          filter: "blur(1px)",
          duration: 0.5,
        });
        setTimeout(function () {
          deleteBtnHandler(task.dataset.id);
        }, 1000);
      })
    );

    [...document.querySelectorAll(".btn-edit")].forEach((editBtn) =>
      editBtn.addEventListener("click", function () {
        const task = editBtn.closest(".task");
        gsap.to(task, { opacity: 0, duration: 0.5 });

        setTimeout(function () {
          task.style.display = "none";
        }, 500);

        const elementBeforeTobeInserted = task.nextElementSibling;

        setTimeout(function () {
          editBtnHandler(task.dataset.id, elementBeforeTobeInserted);
        }, 500);

        console.log(task);
      })
    );

    const icons = document.querySelectorAll(".to-do-radio-btn");

    if (icons) {
      icons.forEach((icon) => {
        icon.addEventListener("mouseenter", () => {
          icon.setAttribute("name", "checkmark-circle-outline");
        });
      });
      icons.forEach((icon) => {
        icon.addEventListener("mouseleave", () => {
          icon.setAttribute("name", "radio-button-off-outline");
        });
      });
    }
  }

  _generateMarkupTask(task) {
    return `  <figure class="task" data-id = ${task.id}>
    <ion-icon name="radio-button-off-outline" class="to-do-radio-btn ${
      task.pirority
    }"></ion-icon>

    <div class="task-info">
    <p class="task-title">${task.title}</p>
 ${
   task.description === ""
     ? ""
     : `<p class="task-description">(${task.description})</p>`
 }
    </div>

    <!-- Box for edit btn and timeline icon -->
    <div class="edit-time-box"> 
      <div class="edit-delete-btn">
        <button class="btn-edit"><ion-icon name="create-outline"></ion-icon></button>
        <button class="btn-delete"><ion-icon name="remove-outline" class="icon-delete"></ion-icon></button>
        </div>
   ${
     task.deadline === "none"
       ? ""
       : `<p class="deadline-slot"> <ion-icon name="alarm-outline" class="icon-time"></ion-icon> ${task.deadline}</p>`
   } 
    </div>
</figure>`;
  }

  _generateMarkup(el, cat, edit = "Add") {
    if (el == "form")
      return ` <form class="add-task-form">
         
    <input type="text" id="" name="title" placeholder="Practise coding" class="input-task-title text-input">

  <input type="text" id="" name="description" placeholder="Description" class="input-task-description text-input">

  <div class="input-priority-options">

   <div class="input-radio-priority">
    <input type="radio" id="p1" name="p" value="p1" class="option" >
    <label for="p">  <ion-icon name="flag-outline" class="p1" ></ion-icon> Must</label>
   </div>

   <div class="input-radio-priority">
   <input type="radio" id="p2" name="p" value="p2" class="option">
   <label for="p"> <ion-icon name="flag-outline" class="p2"></ion-icon> Should </label>
   </div>

   <div class="input-radio-priority">
   <input type="radio" id="p3" name="p" value="p3" class="option" checked>
   <label for="p">  <ion-icon name="flag-outline" class="p3"></ion-icon> Could</label>
   </div>
 </div>

 ${
   cat === "general"
     ? "<div></div>"
     : `<div class="select-time-options">
 <label for="time-period"> Schedule it:</label>
 <select id="deadline-option"  class="deadline-option" name="time_period">
   <option value="none">None</option>
 <option value="morning">Morning (6:00 AM - 12:00 PM)</option>
 <option value="afternoon">Afternoon (12:00 PM - 6:00 PM)</option>
 <option value="evening">Evening (6:00 PM - 9:00 PM)</option>
 <option value="night">Night (9:00 PM - 6:00 AM)</option>
 </select>
</div>`
 }


 <div class="form-btns">
<button class="btn btn-cancel-form">Cancel</button>
<button  class="btn-add-task-form btn" data-cat = "${cat}">${edit} task</button>
</div>
 
</form>`;
  }

  renderError(message, cat, submitHandler, cancelHnadler, data, id, el) {
    data.cat = cat;
    data.pirority = data.p;
    data.id = id;
    document.querySelector(".add-task-form").innerHTML = message;
    const html = this._generateMarkup("form", cat);
    setTimeout(
      function () {
        document.querySelector(".add-task-form").remove();
        this.render(cat, submitHandler, cancelHnadler, el, data);
        console.log(data);
      }.bind(this),
      1000
    );
  }

  _generateTaskDoneMarkup(taskArr, cat) {
    const catTask = taskArr.filter((task) => task.cat === cat);

    const taskDone = taskArr.filter((task) => task.done && task.cat === cat);

    if (taskDone.length === 0) {
      return "";
    }

    const html = taskDone
      .map((task) => {
        return ` <li class="done-list-item"><ion-icon name="checkmark-outline" class="checked-icon"></ion-icon>${task.title}</li>
`;
      })
      .join("");

    console.log(`<h5 class="heading">One step closer 🚀</h5>` + html);

    return (
      `<h5 class="heading">${
        catTask.length === taskDone.length
          ? "Crushed it 💪"
          : "One step closer 🚀"
      }</h5>` + html
    );
  }

  renderTaskDone(taskArr) {
    const generalTaskDoneContainer = document.querySelector(
      ".container-grid-task-done-general"
    );
    const dailyTaskDoneContainer = document.querySelector(
      ".container-grid-task-done-daily"
    );

    dailyTaskDoneContainer.innerHTML = "";
    generalTaskDoneContainer.innerHTML = "";
    const gnTaskDoneHtml = this._generateTaskDoneMarkup(taskArr, "general");
    const dlTaskDoneHtml = this._generateTaskDoneMarkup(taskArr, "daily");

    gnTaskDoneHtml === ""
      ? (generalTaskDoneContainer.style.display = "none")
      : (generalTaskDoneContainer.style.display = "flex");

    dlTaskDoneHtml === ""
      ? (dailyTaskDoneContainer.style.display = "none")
      : (dailyTaskDoneContainer.style.display = "flex");

    generalTaskDoneContainer.insertAdjacentHTML("afterbegin", gnTaskDoneHtml);
    dailyTaskDoneContainer.insertAdjacentHTML("afterbegin", dlTaskDoneHtml);
  }

  renderCurDate(state) {
    console.log(state);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const date = new Date(); // Example: current date

    const weekday = days[date.getDay()];

    const month = `${months[date.getMonth()]}`;

    document.querySelector(
      ".cur-date"
    ).textContent = `${`${date.getDate()}`.padStart(
      2,
      "0"
    )} ${month}(${weekday})`;
  }

  renderQuote(quote) {
    console.log(quote);
    document.querySelector(
      ".quote-text"
    ).innerHTML = `<span class="quote-paran">“</span>${quote.quote}<span class="quote-paran">”`;
    document.querySelector(".quote-author").innerHTML = `―${quote.author}`;
  }

  playSound() {
    const sound = document.getElementById("suctionSound");
    sound.currentTime = 0; // Reset to the beginning
    sound.play();
  }
}

export default new ViewForm();
