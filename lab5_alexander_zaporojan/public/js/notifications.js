const socket = io();
const notifications = document.getElementById('notifications');

socket.on('courseCreated', (data) => {
    const box = document.createElement('div');
    box.className = 'notification';

    const title = document.createElement('p');
    title.textContent = 'Добавлен новый курс: ' + data.title;

    const teacher = document.createElement('p');
    teacher.textContent = 'Преподаватель: ' + data.teacher;

    const time = document.createElement('small');
    time.textContent = 'Время: ' + data.time;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть';
    closeButton.addEventListener('click', () => {
        box.remove();
    });

    box.appendChild(title);
    box.appendChild(teacher);
    box.appendChild(time);
    box.appendChild(closeButton);
    notifications.appendChild(box);

    setTimeout(() => {
        box.remove();
    }, 8000);
});
