'use strict';

const rootEl = document.getElementById('root');

const formEl = document.createElement('form');
formEl.dataset.id = 'todo-form';
rootEl.appendChild(formEl);

const todoTextDivEl = document.createElement('div');
formEl.appendChild(todoTextDivEl);

const todoTextLblEl = document.createElement('label');
todoTextLblEl.for = 'todo-text';
todoTextLblEl.textContent = 'Название';
todoTextLblEl.htmlFor = 'todo-text';
todoTextDivEl.appendChild(todoTextLblEl);
const todoInputTextEl = document.createElement('input');
todoInputTextEl.dataset.input = 'text';
todoInputTextEl.id = 'todo-text';
todoTextDivEl.appendChild(todoInputTextEl);

const todoPriorDivEl = document.createElement('div');
formEl.appendChild(todoPriorDivEl);

const todoPriorLblEl = document.createElement('label');
todoPriorLblEl.htmlFor = 'todo-priority';
todoPriorLblEl.textContent = 'Приоритет';
todoPriorDivEl.appendChild(todoPriorLblEl);
const todoInputPriorEl = document.createElement('input');
todoInputPriorEl.dataset.input = 'priority';
todoInputPriorEl.id = 'todo-priority';
todoInputPriorEl.type = 'number';
todoPriorDivEl.appendChild(todoInputPriorEl);

const addBtn = document.createElement('button');
addBtn.textContent = 'Добавить';
addBtn.dataset.action = 'add';
formEl.appendChild(addBtn);

const errorEl = document.createElement('label');
errorEl.dataset.id = 'message';
formEl.appendChild(errorEl);

const listEl = document.createElement('ul');
listEl.dataset.id = 'todo-list';
rootEl.appendChild(listEl);

let nextId = 1;
let maxPrior;
const tasks = [];
formEl.onsubmit = (evt) => {
    evt.preventDefault();

    errorEl.textContent = '';
    let error = null;
    const text = todoInputTextEl.value.trim();
    if (text === '') {
        error = 'Заполните поле Название';
        errorEl.textContent = error;
        todoInputTextEl.focus();
        return;
    }
    const priority = Number(todoInputPriorEl.value);
    if (todoInputPriorEl.value === '') {
        error = 'Заполните поле Приоритет';
        errorEl.textContent = error;
        todoInputPriorEl.focus();
        return;
    }
    if (Number.isNaN(priority)) {
        error = 'Неверно введён приоритет';
        errorEl.textContent = error;
        todoInputPriorEl.focus();
        return;
    }
    if (priority <= 0) {
        error = 'Приоритет не может быть отрицательным или нулевым';
        errorEl.textContent = error;
        todoInputPriorEl.focus();
        return;
    }

    const task = {
        id: nextId++,
        text,
        priority,
    };

    formEl.reset();
    todoInputTextEl.focus();

    const rowEl = document.createElement('li');
    rowEl.dataset.todoId = task.id;
    let textEl = document.createTextNode(`${task.text} (приоритет: `);
    rowEl.appendChild(textEl);
    const priorEl = document.createElement('span');
    priorEl.dataset.info = 'priority';
    priorEl.textContent = `${task.priority}`;
    rowEl.appendChild(priorEl);
    textEl = document.createTextNode(')');
    rowEl.appendChild(textEl);

    function sortPriorList() {
        const ind = tasks
            .filter((item) => item.priority < task.priority)
            .reduce(
                (prev, curr) => (prev.priority >= curr.priority ? prev : curr),
                0
            );
        maxPrior = Math.max(task.priority, maxPrior);
        if (tasks.length === 0 || task.priority === 1) {
            listEl.insertBefore(rowEl, listEl.firstElementChild);
        } else {
            if (!ind) {
                return;
            }
            listEl.insertBefore(
                rowEl,
                listEl.querySelector(`[data-todo-id="${ind.id}"]`)
                    .nextElementSibling
            );
        }
    }

    sortPriorList();

    tasks.push(task);

    const incEl = document.createElement('button');
    incEl.dataset.action = 'inc';
    incEl.textContent = '+';
    rowEl.appendChild(incEl);

    const decEl = document.createElement('button');
    decEl.dataset.action = 'dec';
    decEl.textContent = '-';
    rowEl.appendChild(decEl);

    incEl.onclick = () => {
        priorEl.textContent = ++task.priority;
        sortPriorList();
    };
    decEl.onclick = () => {
        if (task.priority > 1) {
            priorEl.textContent = --task.priority;
        }
        sortPriorList();
    };
};
