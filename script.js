"use strict";

// Data
const account1 = {
  owner: "Daniel Adeneye",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
  // Username
  // Balance
};

const account2 = {
  owner: "Samuel Adewale Jr",
  movements: [5000, 3400, -150, -790, -3210, -1000],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Michael Damilola",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith Williams ",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// DATA
const transactionHistory = document.querySelector(".transaction-history-arc");
const balanceValue = document.querySelector(".balance-price");
const balanceSummaryIn = document.getElementById("in-balance");
const balanceSummaryOut = document.getElementById("out-balance");
const balanceInterest = document.getElementById("interest-balance");
const loginUsername = document.getElementById("username");
const loginPin = document.getElementById("user-pin");
const submitLoginBtn = document.getElementById("submit-login");
const introLabel = document.getElementById("intro-statement");
const mainAppSection = document.querySelector(".app");
const transferToUsername = document.getElementById("transfer-to-username");
const transferAmount = document.getElementById("transfer-amount");
const submitTransferBtn = document.getElementById("submit-transfer");
const loanAmount = document.getElementById("loan-amount");
const getLoanBtn = document.getElementById("submit-loan");
const closeAccountUsername = document.getElementById("close-account-username");
const closeAccountPin = document.getElementById("close-account-pin");
const closeAccountBtn = document.getElementById("submit-credentials");
const logoutBtn = document.getElementById("logout-btn");

// Main

// Computing Usernames
const createUsernames = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
  // console.log(account2.username);
};
createUsernames(accounts);

// Updating and displaying movements
let updateMovementsBalanceandDisplay = function (acc) {
  calcDisplayBalance(acc);
  // Display movements
  displayMovements(acc.movements);
  // Display Summary
  calcDisplayFullInOutBalance(acc.movements, acc.interestRate);
};

// Implementing usernames and Logining
let currentAccount;
console.log(account1.username);
submitLoginBtn.addEventListener("click", function (e) {
  // Prevents the page from auto-reloading on submit
  e.preventDefault();

  currentAccount = accounts.find((acc) => {
    return acc.username === loginUsername.value;
  });
  console.log(currentAccount);

  if (currentAccount?.pin === Number(loginPin.value)) {
    // Display welcome
    introLabel.innerHTML = `Welcome ${currentAccount.owner.split(" ")[0]}!`;
    // Display Page
    mainAppSection.style.display = "block";
    let opacityActivate = setInterval(() => {
      mainAppSection.style.opacity += 1;
      clearInterval(opacityActivate);
    }, 500);
    // mainAppSection.style.opacity = 1;

    // Display balance, movements and summary
    updateMovementsBalanceandDisplay(currentAccount);
  } else {
    alert("Invalid Login Details");
  }
  loginUsername.value = "";
  loginPin.value = "";
  // console.log(loginUsername.value);
});

// Using the enter key
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && loginUsername !== "" && loginPin !== "") {
    // Prevents the page from auto-reloading on submit
    e.preventDefault();

    currentAccount = accounts.find((acc) => {
      return acc.username === loginUsername.value;
    });
    console.log(currentAccount);

    if (currentAccount?.pin === Number(loginPin.value)) {
      // Display welcome
      introLabel.innerHTML = `Welcome ${currentAccount.owner.split(" ")[0]}`;
      // Display Page
      mainAppSection.style.display = "block";
      let opacityActivate = setInterval(() => {
        mainAppSection.style.opacity += 1;
        clearInterval(opacityActivate);
      }, 500);
      // mainAppSection.style.opacity = 1;

      // Display balance, movements and summary
      updateMovementsBalanceandDisplay(currentAccount);
    } else {
      alert("Invalid Login Details");
    }
  }
});

// Display History
const displayMovements = function (movements) {
  transactionHistory.innerHTML = "";

  movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `<div class="movements-row">
      <span class="movements-type w-20 movements-type--${type}">${
      i + 1
    } ${type}</span>
      <span class="movements-date w-60">3 days ago</span>
      <span class="movements-value w-20">${mov} &euro;</span>
  </div><hr>`;
    // console.log(html);
    transactionHistory.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1.movements);

// Calc. and display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  // console.log(balanceValue);
  balanceValue.innerHTML = `${acc.balance} &euro;`;
};
calcDisplayBalance(account1);

// Calculating and displaying the In-Balance
const calcDisplayFullInOutBalance = function (movements, interestRate) {
  // Incoming Balance
  const incoming = movements
    .filter((mov) => {
      return mov > 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  balanceSummaryIn.innerHTML = `${incoming}&euro;`;

  // Outgoing Balance
  const outgoing = movements
    .filter((mov) => {
      return mov < 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  balanceSummaryOut.innerHTML = `${Math.abs(outgoing)}&euro;`;

  // Interest Balance
  const interest = movements
    .filter((mov) => {
      return mov > 0;
    })
    .map((mov) => {
      return mov * interestRate - mov;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  balanceInterest.innerHTML = `${Math.abs(interest)}&euro;`;
};
calcDisplayFullInOutBalance(account1.movements, account1.interestRate);

// Implementing Transfers
submitTransferBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(transferAmount.value);
  const transferReceiverAcc = accounts.find((acc) => {
    return acc.username === transferToUsername.value;
  });

  if (
    transferReceiverAcc &&
    transferReceiverAcc?.username !== currentAccount.username &&
    amount > 0 &&
    amount <= currentAccount.balance
  ) {
    // Update movements
    transferReceiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    // Display updates on movements
    updateMovementsBalanceandDisplay(currentAccount);
  } else {
    alert("Invalid Details");
  }
  // Clear inputs
  transferToUsername.value = "";
  transferAmount.value = "";

  console.log(transferReceiverAcc.movements, currentAccount.movements);
});

// Implementing loans
getLoanBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmountValue = Number(loanAmount.value);
  if (loanAmountValue === 0) {
    alert("Invalid Input");
  } else if (
    currentAccount.movements.some((val) => {
      return val >= 0.1 * loanAmountValue;
    })
  ) {
    // Update movements
    currentAccount.movements.push(loanAmountValue);

    // Display updates on movements
    updateMovementsBalanceandDisplay(currentAccount);
  } else {
    alert("Sorry, You're not eligible to take loans.");
  }
  loanAmount.value = "";
});

// Closing Account
closeAccountBtn.addEventListener("click", function (e) {
  let accountToClose = accounts.find((acc) => {
    return acc.username === closeAccountUsername.value;
  });
  let accountToCloseIndex = accounts.findIndex((acc) => {
    return acc.username === closeAccountUsername.value;
  });

  if (
    accountToClose &&
    accountToClose?.username === currentAccount.username &&
    accountToClose?.pin === Number(currentAccount.pin)
  ) {
    console.log("able to close");
    // delete
    accounts.splice(accountToCloseIndex, 1);
    mainAppSection.style.display = "none";
  } else {
    alert("Invalid Details");
  }
  console.log(accounts);
  closeAccountUsername.value = "";
  closeAccountPin.value = "";
});

//  Implement the Logout
logoutBtn.addEventListener("click", function () {
  mainAppSection.style.display = "none";
  introLabel.innerHTML = "Log in to get started";
});

// TODO Create the modals
