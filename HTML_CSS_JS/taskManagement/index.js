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

const toggleButton = document.getElementById('toggleButton');
const slider = document.getElementById('slider');

toggleButton.addEventListener('click', () => {
  slider.classList.toggle('active');
});