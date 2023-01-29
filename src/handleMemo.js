import { memoHTML } from "./_components.js"
import { variables } from "./_classes.js";


const loadLocationInfo = () => {
  return JSON.parse(localStorage.getItem("locationInfo"));
}
const saveLocationInfo = () => {
  localStorage.setItem("locationInfo", JSON.stringify(locationInfo));
}
const onMouseDown = (event, info = "") => {
  const textarea = event.target.parentElement.parentElement.parentElement;
  const textareaControllerBar = event.target;
  const memoKey = textarea.id;
  if (event.which !== 1) {
    return;
  }
  
  textarea.style.zIndex = variables.zIndex;
  const offsetX = event.offsetX;
  const offsetY = event.offsetY;
  function moveAt(pageX, pageY) {
    textarea.style.left = pageX - offsetX + "px";
    textarea.style.top = pageY - offsetY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.clientX, event.clientY);
  }
  
  // (2) mousemove로 공을 움직입니다.
  // 여기를 document객체로 두지 않고 요소(ex textarea~)로 두고하면 빠르게 마우스 커서 움직일때 eventlistener 가 먹통이 되버림
  document.addEventListener("mousemove", onMouseMove);
  
  // 불필요한 핸들러를 제거합니다.
  document.onmouseup = function () {
    locationInfo[memoKey] = { left: textarea.style.left, top: textarea.style.top };
    console.log(locationInfo);
    saveLocationInfo();
    document.removeEventListener("mousemove", onMouseMove);
    document.onmouseup = null;
  };
};

//각각의 textarea요소에 대해서 각각의 textareaController가 있을 것이다.
//
const createMemo = (memoId) => {
  const memoDiv = document.createElement("div");
  memoDiv.style.backgroundColor = variables.randomColor;
  memoDiv.id = memoId;
  memoDiv.className = "textarea";
  memoDiv.innerHTML = memoHTML;
  const memoControllerBar = memoDiv.querySelector(".textarea-controllerBar");
  const memoController = memoControllerBar.parentElement;
  memoControllerBar.addEventListener("mousedown", (event) => { onMouseDown(event) })
  const deleteMemoBtn = memoController.querySelector("i:last-child");
  deleteMemoBtn.addEventListener("click", deleteMemo)
  const memoAddBtn = memoController.querySelector("i");
  memoAddBtn.addEventListener("click", () => {
    const unixTime = new Date().getTime();
    const memoKey = `${userName}_memo_${unixTime}`;
    memoObjectGroup[memoKey] = new MemoClassObj(memoKey);
  });
  document.body.appendChild(memoDiv);
}

const deleteMemo = (event) => {
  const memoDiv = event.target.parentElement.parentElement.parentElement;
  const memoId = memoDiv.id;
  memoDiv.remove()
  localStorage.removeItem(memoId);
  
  delete locationInfo[memoId]
  saveLocationInfo()
}



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
  // confirmButton.addEventListener("click", modifyToDo);
  const deleteButton = document.createElement("i");
  deleteButton.className = "fa-solid fa-circle-xmark color-red";
  // deleteButton.addEventListener("click", deleteToDo);
  newLi.appendChild(checkboxInput);
  newLi.appendChild(textInput);
  newLi.appendChild(confirmButton);
  newLi.appendChild(deleteButton);
  return newLi;
};
class MemoClassObj {
  constructor(memoKey) {
    //memoList는 global variable로써 사전에 선언 되어있어야된다.
    this.memoKey = memoKey
    createMemo(this.memoKey);
    this.memoDiv = document.querySelector(`#${memoKey}`);
    this.ul = this.memoDiv.querySelector(`ul`);
    this.savedToDos = localStorage.getItem(memoKey);
    if (!memoList[memoKey]) {
      
      memoList[memoKey] = {};
    }
    this.toDoObj = memoList[memoKey];//이게 pointer를 가져옴
    this.loadToDos(this.savedToDos);
    this.setLocation();
    this.addBtn = this.memoDiv.querySelector(".buttons .add");
    this.addBtn.addEventListener("click", () => this.addToDo())
  }
  addToDo(toDoKey = null, toDo = "", loading = false) {
    //toDoObj에 추가해주고, li 추가 해주는 작업
    toDoKey = toDoKey ? toDoKey : Object.keys(this.toDoObj).length;//toDoKey가 없으면 autoincrement
    this.toDoObj[toDoKey] = toDo;
    
    const liElement = lineElement(toDoKey, toDo);
    const confirmButton = liElement.querySelector("i:first-of-type");
    confirmButton.addEventListener("click", (event) => this.modifyToDo(event));
    const textInput = liElement.querySelector(".textarea-div");
    
    textInput.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
        event.target.blur();
        event.preventDefault();//앤터키 동작안되도록 설정
        confirmButton.click();// 버튼 클릭 동작시킴
        
      }
    })
    const deleteButton = liElement.querySelector("i:last-of-type");
    deleteButton.addEventListener("click", (event) => this.deleteToDo(event));
    this.ul.appendChild(liElement);
    if (!loading) {
      
      this.saveToDos();
    }
  }
  
  saveToDos() {
    localStorage.setItem(this.memoKey, JSON.stringify(this.toDoObj));
  }
  loadToDos(savedToDos) {
    //savedToDos로 부터 li를 생성해야된다. 최초 class선언시에 한번만 실행해주면 된다.
    const parsedSavedToDos = savedToDos !== null ? JSON.parse(savedToDos) : {};//예외처리 필요없을거같긴한데 혹시몰라 넣음
    for (const toDoKey in parsedSavedToDos) {
      this.addToDo(toDoKey, parsedSavedToDos[toDoKey], true);
    }
  }
  deleteToDo(event) {
    
    const li = event.target.parentElement;
    const toDoKey = li.key;
    
    
    li.remove();
    delete memoList[this.memoKey][toDoKey];
    this.saveToDos();
  }
  modifyToDo(event) {
    const li = event.target.parentElement;
    const key = li.key;
    const textInput = li.querySelector(".textarea-div");
    const innerText = textInput.innerText
    this.toDoObj[key] = innerText;
    this.saveToDos();
  }
  setLocation() {
    const locationInfo = JSON.parse(localStorage.getItem("locationInfo"))[this.memoKey];
    
    if (locationInfo) {
      console.log(locationInfo, this.memoKey, "inininin");
      this.memoDiv.style.top = locationInfo.top;
      this.memoDiv.style.left = locationInfo.left;
    }
  }
}

const loadUserData = (userName) => {
  //1. localstroage에서 memeKey를 확인하여 user와 연관있는 것만 가져온다
  //2. 루프를 돌면서 하나씩 메모를 로딩시켜준다. (memoList에 추가도해줘)
  for (const memoKey in localStorage) {//이렇게 for문 돌리면 안에 함수까지 다나오네.. 노답
    
    if (memoKey.startsWith(userName)) {
      console.log("기존데이터 로딩")
      memoObjectGroup[memoKey] = new MemoClassObj(memoKey);
    }
  }
  if (!Object.keys(memoObjectGroup).length) { // localstorage에 아무런 항목이 존재하지 않으면 하나 생성시켜준다. 
    console.log("신규메모 생성");
    const unixTime = new Date().getTime();
    const memoKey = `${userName}_memo_${unixTime}`;
    memoObjectGroup[memoKey] = new MemoClassObj(memoKey);
    
  }
}
let memoList = {};
let userName;
const locationInfo = loadLocationInfo();
const memoObjectGroup = {};

const loginFormBox = document.querySelector(".form_box"); 
const nameInput = loginFormBox.querySelector("input");
const loginBtn = loginFormBox.querySelector("button");
loginBtn.addEventListener("click", () => {
  loginFormBox.className = "hidden";
  userName = nameInput.value;
  loadUserData(userName);
})

// createMemo(memoKey);



// const loadToDos = (key) => {
  //   const ulToDo = document.querySelector(`#${key} ul`);
  //   const savedToDos = localStorage.getItem(key);
  //   toDoList = savedToDos !== null ? JSON.parse(savedToDos) : {};

  //   for (const toDo in toDoList) {
    
    //     addToDo
//   }
// }

