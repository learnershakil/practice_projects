const toggleButton = document.getElementById('toggleButton');
const slider = document.getElementById('slider');
const tasks = document.querySelectorAll('.task');
const columns = document.querySelectorAll('.column');

let draggedTask = null;


tasks.forEach(task => {
  task.addEventListener('dragstart', (e) => {
    draggedTask = task;
    e.target.className += ' hold';
    setTimeout(() => {
      e.target.className = 'hide';
    }, 0);
  });

  task.addEventListener('dragend', (e) => {
    e.target.className = 'task';
  });
});

columns.forEach(column => {
  column.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  column.addEventListener('dragenter', (e) => {
    e.target.classList.add('enter');
  });

  column.addEventListener('dragleave', (e) => {
    e.target.classList.remove('enter');
  });

  column.addEventListener('drop', (e) => {
    e.preventDefault();
    e.target.classList.remove('enter');
    e.target.appendChild(draggedTask);
  });
});





toggleButton.addEventListener('click', (e) => {
  e.stopPropagation(); 
  slider.classList.toggle('active');
});


document.addEventListener('click', (e) => {
  if (!slider.contains(e.target) && !toggleButton.contains(e.target)) {
    slider.classList.remove('active');
  }
});


slider.addEventListener('submit', (e) => {
  e.preventDefault();


  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();

  if (taskText) {

    const newTask = document.createElement('div');
    newTask.className = 'task';
    newTask.draggable = true;
    newTask.textContent = taskText;


    newTask.addEventListener('dragstart', (e) => {
      draggedTask = newTask;
      e.target.className += ' hold';
      setTimeout(() => {
        e.target.className = 'hide';
      }, 0);
    });

    newTask.addEventListener('dragend', (e) => {
      e.target.className = 'task';
    });


    document.getElementById('todo').appendChild(newTask);


    taskInput.value = '';
  }
});