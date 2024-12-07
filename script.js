$(document).ready(function () {
    let taskList = [];
  
    // Function to render the To-Do List dynamically
    function renderTasks(filterType = "all") {
      const $taskList = $("#taskList");
      $taskList.empty();
  
      let filteredTasks = [];
      if (filterType === "completed") {
        filteredTasks = taskList.filter((task) => task.completed);
      } else if (filterType === "incomplete") {
        filteredTasks = taskList.filter((task) => !task.completed);
      } else {
        filteredTasks = taskList;
      }
  
      filteredTasks.forEach((task, index) => {
        const taskItem = `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
            <div>
              <button class="btn btn-sm btn-success toggle-completed" data-index="${index}">${
          task.completed ? "Undo" : "Complete"
        }</button>
              <button class="btn btn-sm btn-danger delete-task" data-index="${index}">Delete</button>
            </div>
          </li>
        `;
        $taskList.append(taskItem);
      });
    }
  
    // Add Task Event
    $("#addTask").click(function () {
      const taskInput = $("#taskInput").val().trim();
      if (taskInput) {
        const newTask = { name: taskInput, completed: false };
        taskList.push(newTask);
        renderTasks();
        $("#taskInput").val("");
      }
    });
  
    // Handle task toggle completion
    $(document).on("click", ".toggle-completed", function () {
      const index = $(this).data("index");
      taskList[index].completed = !taskList[index].completed;
      renderTasks();
    });
  
    // Handle delete confirmation modal
    let deleteIndex;
    $(document).on("click", ".delete-task", function () {
      deleteIndex = $(this).data("index");
      $("#deleteModal").modal("show");
    });
  
    $("#confirmDelete").click(function () {
      if (deleteIndex !== undefined) {
        taskList.splice(deleteIndex, 1);
        $("#deleteModal").modal("hide");
        renderTasks();
      }
    });
  
    // Handle filtering logic
    $("#filterTasks").change(function () {
      renderTasks($(this).val());
    });
  
    // Initial Render
    renderTasks();
  });
  