const addPaymentAccounts = document.getElementById("blance-btn");
const initBalanceBtn = document.getElementById("init-balance-btn");
const checkBalanceBtn = document.getElementById("check-balance-btn");
const recordMenu = document.getElementById("record-menu-btn");
const recordBtn = document.getElementById("record-btn");
const checkRecordBtn = document.getElementById("check-record-btn");
const closeTaskFormButtonBalance = document.getElementById("close-task-form-btn-balance");
const confirmCloseDialogBalance = document.getElementById("confirm-close-dialog-balance");
const closeTaskFormButtonAccount = document.getElementById("close-task-form-btn-account");
const confirmCloseDialogAccount = document.getElementById("confirm-close-dialog-account");
const accountName = document.getElementById("account-name");
const initBalance = document.getElementById("init-balance");
const addBalance = document.getElementById("add-balance-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtnBalance = document.getElementById("discard-btn-balance");
const discardBtnAccount = document.getElementById("discard-btn-account");
const output = document.getElementById("output");
const accountSelect = document.getElementById("account");
const typeofRecord = document.getElementsByName("type-of-spending");
const amount = document.getElementById("amount");
const description = document.getElementById("description");
const date = document.getElementById("date-input");
const addRecordButton = document.getElementById("add-record-btn");
const balanceForm = document.getElementById("balance-form");
const recordForm = document.getElementById("record-form");
const accountExisted = document.getElementById("account-existed");
const noBalance = document.getElementById("no-balance");
const notEnoughBalacne = document.getElementById("not-enough-balance");
const confirmClearAllData = document.getElementById("confirm-clear-all-data");
const okay = document.getElementById("okay");
const home = document.getElementById("home");
const greeting = document.getElementById("greeting");
const confirm = document.getElementById("confirm");
const clearData = document.getElementById("clear-all-btn");
const confirmClear = document.getElementById("confirm-clear-btn");
let balances = JSON.parse(localStorage.getItem("balances")) || [];
let currentScreen = ""; //balance menu, no account stored, record menu, display account, no record page, display record
let records = JSON.parse(localStorage.getItem("records")) || [];
let currentRecord = [];


//function to hide or unhide the payment menu
const hideorUnhideBalanceMenu = () => {
    initBalanceBtn.classList.toggle("hidden");
    checkBalanceBtn.classList.toggle("hidden");
};

//function to hide or unhide the record menu
const hideorUnhideRecordMenu = () => {
    recordBtn.classList.toggle("hidden");
    checkRecordBtn.classList.toggle("hidden");
}

//function to hide or unhide the home button 
const hideorUnhideHomeButton = () => {
    home.classList.toggle("hidden");
}
//function to hide or unhide the button
const hideorUnhideButton = () => {
    addPaymentAccounts.classList.toggle("hidden");
    recordMenu.classList.toggle("hidden");
    clearData.classList.toggle("hidden");
};

//function to hide or unhide the initial balance form 
const hideorUnhideBalanceForm = () => {
    balanceForm.classList.toggle("hidden");
};

//function to hide or unhide the record form 
const hideorUnhideRecordForm = () => {
    displayOptions();
    recordForm.classList.toggle("hidden");
};

//function to display the selection element in html
const displayOptions = () => {
    accountSelect.innerHTML = "";
    balances.forEach(
        ({ account }) => {
            (accountSelect.innerHTML += `
            <option value="${account}">${account}</option>
            `)
        }
    );
};

//function to return the index of the balance 
function findIndex(accountName){
    for(let i = 0; i < balances.length; i++){
        if (balances[i].account === accountName){
            return i;
        }
    }
    return -1;
}

//function to check whether the record is valid or not
function isRecordValid(record) {
    let account = record.account;
    let type = record.type;
    let value = record.amount;
    let remainAmount = balances[findIndex(account)].balance;
    if (type === "none"){
        return false;
    }
    if(type === "expense" && (Number(remainAmount) < Number(value))){
        return false;
    }
    return true;
}

//function to find checked radio button
function findChecked(){
    let type = "";
    for(let i = 0; i < typeofRecord.length; i++){
        if (typeofRecord[i].checked){
            type = typeofRecord[i].value;
        }
    }
    return type;
}

//function to store record as a temporary object
function storeRecordTemp() {
    let type = findChecked();
    
    obj = {
        account: accountSelect.value,
        type: type,
        amount: amount.value,
        date: date.value,
        description: description.value,
    }
    return obj;
} 

//function to update payment account
function updateBalance(obj){
    let account = obj.account;
    let type = obj.type;
    let amount = obj.amount;
    let index = findIndex(account);
    if(type==="income"){
        balances[index].balance =  (Number(balances[index].balance) + Number(amount)).toString();
    }
    else if (type === "expense"){
        balances[index].balance =  (Number(balances[index].balance) - Number(amount)).toString();
    }
}

//function to trigger a dialog for not enough balance left
function triggerNotEnoughBalance(){
    notEnoughBalacne.showModal();
}

//function to trigger a dialog before deleting all data
function triggerCleanData(){
    confirmClearAllData.showModal();
}

//function to store the obj into array
function storeRecord(){
    obj = storeRecordTemp();
    if(addRecordButton.innerText === "Update record"){
        const dataArrIndex = records.findIndex(
            (item) => `${item.account}-${item.type}-${item.amount}-${item.date}-${item.description}` === `${currentRecord.account}-${currentRecord.type}-${currentRecord.amount}-${currentRecord.date}-${currentRecord.description}`
          );
        if(currentRecord.type !== findChecked()){
            changeRecord(records[dataArrIndex]);
            updateBalance(records[dataArrIndex]);
        }
        if(currentRecord.amount !== amount.value){
            let diff = Number(currentRecord.amount)-Number(amount.value);
            obj.amount = Math.abs(diff).toString();
            console.log(obj);
            updateBalance(obj);
        }
        updateEditedRecord(dataArrIndex, accountSelect.value, findChecked(), amount.value, date.value, description.value);
        localStorage.setItem("records", JSON.stringify(records));
    }
    else if(isRecordValid(obj) === true){
        records.push(obj);
        currentRecord = obj;
        updateBalance(obj);
        localStorage.setItem("records", JSON.stringify(records));
    }else {
        triggerNotEnoughBalance();
    }
    resetRecord();
}

//function to initial balance account
const initialBalance = () => {
    if (addBalance.innerText === "Update payment account"){
        const dataArrIndex = balances.findIndex(
            (item) => item.account === accountName.value
          );
        updateEditedBalance(dataArrIndex, accountName.value, initBalance.value);
        localStorage.setItem("balances", JSON.stringify(balances));
    }else if(!isExistedBalance(accountName.value)){
        const obj = {
            account: accountName.value,
            balance: initBalance.value,
        }
        balances.push(obj);
        localStorage.setItem("balances", JSON.stringify(balances));
    }else {
        triggerDialog();
    }
};

//function to reset the screen
function resetBalance(){
    hideorUnhideBalanceForm();
    hideorUnhideButton();
    accountName.value = "";
    initBalance.value = "";
};

//function to reset the screen
function resetRecord(){
    hideorUnhideRecordForm();
    hideorUnhideButton();
    for(let i = 0; i < typeofRecord.length; i++){
        typeofRecord[i].checked = false;
    }
    amount.value = "";
    date.value = "";
    description.value ="";
};

//function to clear all stored data
function clearAllData(){
    balances = [];
    records = [];
    currentScreen = "";
    localStorage.setItem("balances", JSON.stringify(balances));
    localStorage.setItem("records", JSON.stringify(records));
}

//function to delete the stored records
const deleteRecord = (buttonEl) => {
    const dataArrIndex = records.findIndex(
      (item) => `${item.account}-${item.type}-${item.amount}-${item.date}-${item.description}` === buttonEl.parentElement.id
    );
    changeRecord(records[dataArrIndex]);
    buttonEl.parentElement.remove();
    records.splice(dataArrIndex, 1);
    localStorage.setItem("records", JSON.stringify(records));
  }

//function to change the original record before deleting
function changeRecord(obj){
    if (obj.type === "income"){
        obj.type = "expense";
    }else{
        obj.type = "income";
    }
    updateBalance(obj);
}

//function to delete the stored balance
const deleteBalance = (buttonEl) => {
    const dataArrIndex = balances.findIndex(
      (item) => item.account === buttonEl.parentElement.id
    );
  
    buttonEl.parentElement.remove();
    balances.splice(dataArrIndex, 1);
    localStorage.setItem("balances", JSON.stringify(balances));
  }

//function to edit the stored balance
const editBalance = (buttonEl) => {
    const dataArrIndex = balances.findIndex(
    (item) => item.account === buttonEl.parentElement.id
  );

  let currentBalance = balances[dataArrIndex];

  accountName.value = currentBalance.account;
  initBalance.value = currentBalance.balance;
  
  output.innerHTML = "";
  addBalance.innerText = "Update payment account";
  balanceForm.classList.toggle("hidden");  
  hideorUnhideHomeButton();
}

//function to edit the stored record
const editRecord = (buttonEl) => {
    const dataArrIndex = records.findIndex(
    (item) => `${item.account}-${item.type}-${item.amount}-${item.date}-${item.description}` === buttonEl.parentElement.id
  );

  currentRecord = records[dataArrIndex];

  accountSelect.value = currentRecord.account;
  if (currentRecord.type === "income"){
    typeofRecord[0].checked = true;
  }else {
    typeofRecord[1].checked = true;
  }
  amount.value = currentRecord.amount;
  description.value = currentRecord.description;
  date.value = currentRecord.date;
  
  output.innerHTML = "";
  addRecordButton.innerText = "Update record";
  recordForm.classList.toggle("hidden");  
  hideorUnhideHomeButton();
}

//function to replace the updated content
function updateEditedBalance(index, accountName, initBalance) {
    balances[index].account = accountName;
    balances[index].balance = initBalance;
}

//function to replace the updated content
function updateEditedRecord(index, accountName, type, amount, date, description) {
    records[index].account = accountName;
    records[index].type = type;
    records[index].amount = amount;
    records[index].date = date;
    records[index].description = description;
}

//function to display the account details
const updateBalanceContainer = () => {
    output.innerHTML = "";
    currentScreen = "displayAccount";
    balances.forEach(
        ({ account, balance }) => {
            (output.innerHTML += `
            <div class="output" id="${account}">   
              <p><strong>Account Name:</strong> ${account}</p>
              <p><strong>Balance:</strong> ${balance}</p>
              <button onclick="editBalance(this)" type="button" class="btn normal">Edit</button>
              <button onclick="deleteBalance(this)" type="button" class="btn normal">Delete</button> 
              <div class="divider little"></div>
              </div>
          `)
        }
    );
};

//function to display the account details
const updateRecordContainer = () => {
    output.innerHTML = "";
    currentScreen = "displayRecord";
    records.forEach(
        ({ account, type, amount, date, description }) => {
            (output.innerHTML += `
            <div class="output" id="${account}-${type}-${amount}-${date}-${description}">   
              <p><strong>Account Name:</strong> ${account}</p>
              <p><strong>Spending Type:</strong> ${type}</p>
              <p><strong>Amount:</strong> ${amount}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Description:</strong> ${description}</p>
              <button onclick="editRecord(this)" type="button" class="btn normal">Edit</button>
              <button onclick="deleteRecord(this)" type="button" class="btn normal">Delete</button> 
              <div class="divider little"></div>
              </div>
          `)
        }
    );
};

//function to display no account details
const displayNoAccountStored = () => {
    currentScreen = "noAccountStored";
    (output.innerHTML += `
    <div class="no-content">   
      <div class="divider large"></div>
      <p><strong>No Payment Accounts stored yet!</strong></p>
      </div>
  `);
};

//function to display no account details
const displayNoRecordStored = () => {
    currentScreen = "noRecordStored";
    (output.innerHTML += `
    <div class="no-content">   
      <div class="divider large"></div>
      <p><strong>No Records stored yet!</strong></p>
      </div>
  `);
};

const callUpdateRecordContainerBalance = () => {
    hideorUnhideBalanceMenu();
    hideorUnhideHomeButton();
    if (balances.length > 0){
        updateBalanceContainer();
    }else {
        displayNoAccountStored();
    }
};

const callUpdateRecordContainerRecord = () => {
    hideorUnhideRecordMenu();
    hideorUnhideHomeButton();
    if (records.length > 0){
        updateRecordContainer();
    }else {
        displayNoRecordStored();
    }
};

//function to check whether a name of blance is existed
const isExistedBalance = (name) => {
    let isExisted = false;
    if(balances.length == 0) {
        return isExisted;
    }
    for (let i = 0; i < balances.length; i++) {
        if (balances[i].account === name){
            isExisted = true;
        }    
    }
    return isExisted;
};

//function to trigger the dialog
function triggerDialog(){
    accountExisted.showModal();
    greeting.innerHTML = `
    <h3><strong>Welcome!</strong></h3>`;
};

function triggerNoBalanceDialog(){
    noBalance.showModal();
}

function displayDeletedMessage(){
    output.innerHTML = "";
    output.innerHTML = `
    <p id="delete-message"><strong>All data cleared!</strong></p>
    `;
}

function resetDeletedMessage() {
    output.innerHTML = "";
};

closeTaskFormButtonBalance.addEventListener("click", () => {
    confirmCloseDialogBalance.showModal();
  });

closeTaskFormButtonAccount.addEventListener("click", () => {
    confirmCloseDialogAccount.showModal();
  });

cancelBtn.addEventListener("click", () => {
    confirmCloseDialogBalance.close();
    confirmCloseDialogAccount.close();
    confirmClearAllData.close();
});

discardBtnBalance.addEventListener("click", () => {
    confirmCloseDialogBalance.close();
    hideorUnhideBalanceForm();
    hideorUnhideBalanceMenu();
    hideorUnhideHomeButton();
    greeting.innerHTML = `
        <h3><strong>Payment Account Menu</strong></h3>`;
});

discardBtnAccount.addEventListener("click", () => {
    confirmCloseDialogAccount.close();
            hideorUnhideRecordForm();
            hideorUnhideRecordMenu();
            hideorUnhideHomeButton();
    greeting.innerHTML = `
        <h3><strong>Record Menu</strong></h3>`;
});

addPaymentAccounts.addEventListener("click", () => {
    hideorUnhideButton();
    hideorUnhideBalanceMenu();
    hideorUnhideHomeButton();
    currentScreen = "balanceMenu";
    greeting.innerHTML = `
    <h3><strong>Payment Account Menu</strong></h3>`;
});

initBalanceBtn.addEventListener("click", () => {
    hideorUnhideBalanceMenu();
    hideorUnhideBalanceForm();
    hideorUnhideHomeButton();
    greeting.innerHTML = "";
    currentScreen = "balanceMenu";
    addBalance.innerText = "Add payment account";
})

recordMenu.addEventListener("click", () => {
    hideorUnhideButton();
    hideorUnhideRecordMenu();
    hideorUnhideHomeButton();
    greeting.innerHTML = `
    <h3><strong>Record Menu</strong></h3>
    `
    currentScreen = "recordMenu";
    addRecordButton.innerText = "Add record";
});

balanceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    initialBalance();
    resetBalance();
    greeting.innerHTML = `
    <h3><strong>Welcome!</strong></h3>
    `
});

okay.addEventListener("click", () => {
    accountExisted.close();
});

confirm.addEventListener("click", () => {
    noBalance.close();
});

checkBalanceBtn.addEventListener("click", () => {
    callUpdateRecordContainerBalance();
    hideorUnhideHomeButton();
    greeting.innerHTML = "";
});

home.addEventListener("click", () => {
    output.innerHTML="";
    greeting.innerHTML = `
    <h3><strong>Welcome!</strong></h3>`;
    switch (currentScreen){
        case "balanceMenu":
            hideorUnhideBalanceMenu();
            hideorUnhideButton();
            hideorUnhideHomeButton();
            break;
        case "noAccountStored":
            hideorUnhideHomeButton();
            hideorUnhideButton();
            break;
        case "displayAccount":
            hideorUnhideHomeButton();
            hideorUnhideButton();
            break;
        case "recordMenu":
            hideorUnhideHomeButton();
            hideorUnhideRecordMenu();
            hideorUnhideButton();
            break;
        case "noRecordStored":
            hideorUnhideHomeButton();
            hideorUnhideButton();
            break;
        case "displayRecord":
            hideorUnhideHomeButton();
            hideorUnhideButton();
            break;
    }
    
});

recordBtn.addEventListener("click", () => {
    if(balances.length) {
        hideorUnhideRecordForm();
        hideorUnhideRecordMenu();
        hideorUnhideHomeButton();
        greeting.innerHTML = "";
    }else {
        triggerNoBalanceDialog();
    }
    
})

checkRecordBtn.addEventListener("click", () => {
    greeting.textContent = "";
    callUpdateRecordContainerRecord();
    hideorUnhideHomeButton();
})

recordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    storeRecord();
    greeting.innerHTML = `
    <h3><strong>Welcome!</strong></h3>
    `;
})

exit.addEventListener("click", () => {
    notEnoughBalacne.close();
})

clearData.addEventListener("click", triggerCleanData);

confirmClear.addEventListener("click", () => {
    confirmClearAllData.close();
    clearAllData();
    displayDeletedMessage();
    setTimeout(() => {
        resetDeletedMessage();
      }, "1000");
})