const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('taskList');
const filters = document.querySelectorAll('.filters button');
const countEl = document.getElementById('count');
const clearCompletedBtn = document.getElementById('clearCompleted');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
  list.innerHTML = '';

  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const left = document.createElement('div');
    left.className = 'left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(span);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    list.appendChild(li);
  });

  countEl.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ id: Date.now(), text, completed: false });
  input.value = '';
  save();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
});

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

render();
