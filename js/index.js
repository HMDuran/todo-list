// DOM Elements
const todoForm   = document.getElementById('todo-form');
const todoInput  = document.getElementById('todo-input');
const taskTotal  = document.getElementById('task-total');
const todoList   = document.getElementById('todo-list');

class Todo {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.loadTasks();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  createTodo() {
    const todoInputValue = todoInput.value;

    if (todoInputValue === '') {
      return;
    }

    const task = {
      id: Date.now(),
      taskText: todoInputValue,
      taskDone: false
    };

    this.tasks.push(task);
    this.saveTasks();
    this.createListTodos();
    this.countTodoTotal();
    todoInput.value = '';
  }

  createListTodos() {
    todoList.innerHTML = '';

    this.tasks.forEach(task => {
      const listItem = document.createElement('li');
      listItem.setAttribute('class', 'list__item');

      if (task.taskDone) {
        listItem.classList.add('list__item--checked');
      }

      const taskListMarkUp = `
        <div class="item"> 
          <input class="item__checkbox--round" type="checkbox" data-task-id="${task.id}" ${task.taskDone ? 'checked' : ''}/>  
          <span class="item__text">${task.taskText}</span> 
        </div>
        <div class="item-button"> 
          <button class="item-button__edit" type="button"> 
            <img class="item-button__edit--icon" src="./assets/edit.svg" alt="Edit Task Button Icon"/>
          </button> 
          <button class="item-button__delete" type="button">  
            <img class="item-button__delete--icon" src="./assets/trash.svg" alt="Delete Task Button Icon" />
          </button>
        </div>`;

      listItem.innerHTML = taskListMarkUp;
      todoList.append(listItem);
    });

    // Add event listener to checkboxes
    document.querySelectorAll('.item__checkbox--round').forEach(checkbox => {
      checkbox.addEventListener('change', ({ target }) => {
        const { taskId } = target.dataset;
        this.markAsDone(parseInt(taskId), target.checked);
      });
    });

    // Add event listener to edit task button
    document.querySelectorAll('.item-button__edit').forEach(button => {
      button.addEventListener('click', (event) => {
        const listItem = event.currentTarget.closest('.list__item');
        const taskId = parseInt(listItem.querySelector('.item__checkbox--round').dataset.taskId);
        const taskTextElement = listItem.querySelector('.item__text');
    
        const saveEditedText = () => {
          const editedText = input.value.trim();
          if (editedText === '') {
            this.removeTodo(taskId); 
          } else {
            todo.editTodo(taskId, editedText);
          }
        };
    
        const input = document.createElement('input');
        input.value = taskTextElement.textContent;
        input.classList.add('edit-input');
        input.addEventListener('blur', saveEditedText);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') saveEditedText();
        });
    
        listItem.classList.add('editing');
        taskTextElement.replaceWith(input);
        input.focus();
      });
    });

    // Add event Listener to delete task button
    document.querySelectorAll('.item-button__delete').forEach(button => {
      button.addEventListener('click', (event) => {
        const taskId = parseInt(event.currentTarget.closest('.list__item').querySelector('.item__checkbox--round').dataset.taskId);
        this.removeTodo(taskId);
      });
    });   
  }

  removeTodo(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
    this.createListTodos();
    this.countTodoTotal();
  }

  editTodo(id, text) {
    this.tasks.forEach(task => {
      if (task.id === id) {
        task.taskText = text;
      }
    });
    this.saveTasks();
    this.createListTodos();
  }

  countTodoTotal() {
    taskTotal.innerHTML = this.tasks.length;

    taskTotal.style.display = this.tasks.length === 0 ? 'none' : 'flex';
  }

  markAsDone(id, done) {
    this.tasks.forEach(task => {
      if (task.id === id) {
        task.taskDone = done;
      }

      const checkbox = document.querySelector(`[data-task-id="${id}"]`);
      if (checkbox) {
        checkbox.checked = done;
      }
      
      const listItem = checkbox?.closest('.list__item');
      if (listItem) {
        listItem.classList.toggle('list__item--checked', done);
      }
    });
    this.saveTasks();
  }

  loadTasks() {
    this.createListTodos();
    this.countTodoTotal();
  }
}

// Create a new instance of the Todo class
const todo = new Todo();

// Add event listener to the todoForm
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  todo.createTodo();
})