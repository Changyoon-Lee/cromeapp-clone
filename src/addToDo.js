
let toDoList = {};
const ulToDo = document.querySelector("#memo_1 ul");
const lineElement = (key, toDo) => {
  const newLi = document.createElement("li");
  newLi.key = key;
  const checkboxInput = document.createElement("input");
  checkboxInput.type = "checkbox";
  const textInput = document.createElement("div");
  textInput.className = "textarea-div";
  textInput.contentEditable = true;
  textInput.role = "textbox";
  textInput.innerText = toDo; //toDo;
  textInput.width = "100px";
  const confirmButton = document.createElement("i");
  confirmButton.className = "fa-solid fa-circle-check color-blue";
  confirmButton.addEventListener("click", modifyToDo);
  const deleteButton = document.createElement("i");
  deleteButton.className = "fa-solid fa-circle-xmark color-red";
  deleteButton.addEventListener("click", deleteToDo);
  newLi.appendChild(checkboxInput);
  newLi.appendChild(textInput);
  newLi.appendChild(confirmButton);
  newLi.appendChild(deleteButton);
  return newLi;
};
const saveToDos = () => {
  localStorage.setItem("toDo", JSON.stringify(toDoList));
};
const addToDo = (key = null, toDo = "", loading = false) => {
  key = key ? key : Object.keys(toDoList).length;
  toDoList[key] = toDo;
  ulToDo.appendChild(lineElement(key, toDo));
  if (!loading) {
    saveToDos();
  }
};
const modifyToDo = (event) => {
  const li = event.target.parentElement;
  const key = li.key;
  const textInput = li.querySelector(".textarea-div");
  const innerText = textInput.innerText;
  console.log(key, innerText);
  toDoList[key] = innerText;
  saveToDos();
};
const deleteToDo = (event) => {
  const li = event.target.parentElement;
  const key = li.key;
  li.remove();
  delete toDoList[key];
  saveToDos();
};
const loadToDos = () => {
  const savedToDos = localStorage.getItem("toDo");
  console.log(JSON.parse(savedToDos));

  toDoList = savedToDos !== null ? JSON.parse(savedToDos) : {};
  for (const key in toDoList) {
    addToDo(key, toDoList[key], true);
  }
};


const addBtn = document.querySelector(".buttons .add");
addBtn.addEventListener("click", () => addToDo());
// main

loadToDos();
