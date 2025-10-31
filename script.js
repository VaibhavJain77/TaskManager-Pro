const todos = JSON.parse(localStorage.getItem("todos")) || []
let currentFilter = "all"
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos))
}
function renderTodos() {
  const todoList = document.getElementById("todoList")
  todoList.innerHTML = ""
  const filteredTodo = todos.filter((todo) => {
    if (currentFilter === "completed") return todo.completed;
    if (currentFilter === "pending") return !todo.completed;
    return true
  })
  filteredTodo.forEach((todo, index) => {
    const li = document.createElement("li")
    if (todo.completed) {
      li.classList.add("completed");
    }
    li.innerHTML = `
      <div class="todo-content">
        <span class="todo-text" ondblclick="startEdit(${index}, this)">${todo.text}</span>

      </div>
      <div class="todo-actions">
        <button onclick="toggleTodo(${index})" class="action-btn complete-btn">
          <i class="fas ${todo.completed ? "fa-rotate-left" : "fa-check"}"></i>
        </button>
        <button onclick="deleteTodo(${index})" class="action-btn delete-btn">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    todoList.append(li)
  });

}
function addTodos() {
  const input = document.getElementById("todoInput")
  const todo = input.value.trim()
  if (todo) {
    todos.push({
      text: todo,
      completed: false
    })

    input.value = ""
    saveTodos()
    renderTodos()
  }
}
function toggleTodo(index) {
  todos[index].completed = !todos[index].completed
  saveTodos()
  renderTodos()
}
function deleteTodo(index) {
  todos.splice(index, 1)
  saveTodos()
  renderTodos()
}
document.getElementById("todoInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodos()
  }
})
document.querySelector(".filters").addEventListener("click", function (e) {
  const filterBtn = e.target.closest(".filter-btn");
  if (!filterBtn) return;

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  filterBtn.classList.add("active");
  currentFilter = filterBtn.dataset.filter;
  renderTodos();
});

// Initial render
renderTodos();
function startEdit(index, element) {
  const currentText = todos[index].text;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "edit-input";
  element.replaceWith(input); 
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      finishEdit(index, input);
    }
  });
  input.addEventListener("blur", function () {
    finishEdit(index, input);
  });
}

function finishEdit(index, input) {
  const newText = input.value.trim();
  if (newText) {
    todos[index].text = newText;
    saveTodos();
  }
  renderTodos();
}

