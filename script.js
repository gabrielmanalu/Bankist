'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Gabriel Manalu",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const usernames = function(accs) {
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};
usernames(accounts);

const updateUi = function(acc) {
  displayMovements(acc);
  displayBalance(acc);
  displaySummary(acc);
}

const displayMovements = function(accs, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? accs.movements.slice().sort((a, b) => a - b) : accs.movements;

    movs.forEach(function (mov, i){
      const type = mov > 0 ? 'deposit' : 'withdrawal'

      const date = new Date(accs.movementsDates[i]);
      const day = `${date.getDate()}`.padStart(2,0);
      const month = `${date.getMonth() + 1}`.padStart(2,0)
      const year = date.getFullYear();
      const displayDate = `${year}/${month}/${day}`;

      const html =  `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html)
    });
}

const displayBalance = function(accs) {
  accs.balance = accs.movements.reduce((cur, mov) => cur + mov, 0);
  labelBalance.textContent = `$${accs.balance}`;
}

const displaySummary = function(accs){
  const income = accs.movements.filter(mov => mov > 0).reduce((cur, mov) => cur + mov, 0);
  labelSumIn.textContent = `$${income}`;

  const outcome = accs.movements.filter(mov => mov < 0).reduce((cur, mov) => cur + mov, 0);
  labelSumOut.textContent = `$${Math.abs(outcome)}`;

  const interest = accs.movements.filter(mov => mov > 0).map(deposit => (deposit * accs.interestRate) / 100)
                  .filter((int) => int >= 1).reduce((cur, mov) => cur + mov, 0);
  labelSumInterest.textContent = `$${interest.toFixed(2)}`;
}



let currentAccount;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`;
    containerApp.style.visibility = 'visible';
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2,0);
    const month = `${now.getMonth() + 1}`.padStart(2,0)
    const year = now.getFullYear();
    const hour = now.getHours();
    const min = now.getMinutes();
    labelDate.textContent = `${year}/${month}/${day}, ${hour}:${min}`;
    updateUi(currentAccount);
  }
})

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const destination = accounts.find(acc => acc.username === inputTransferTo.value);
  if(amount > 0 && currentAccount.balance 
    >= amount && destination?.username 
    !== currentAccount.username && destination){
      currentAccount.movements.push(-amount);
      currentAccount.movementsDates.push(new Date());
      destination.movements.push(amount);
      destination.movementsDates.push(new Date());
      updateUi(currentAccount);
      inputTransferAmount.value = inputTransferTo.value ='';
    }
});

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  if(inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin){
      const index = accounts.findIndex(acc => acc.username === currentAccount.username);
      containerApp.style.visibility = 'hidden';
      accounts.splice(index, 1);
    }
    inputClosePin = inputCloseUsername = '';
});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)){
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
})

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})
