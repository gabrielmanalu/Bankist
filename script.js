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
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-06-26T17:01:17.194Z",
    "2023-06-28T23:36:17.929Z",
    "2023-07-18T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "ja-JP",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-07-18T12:01:20.894Z",
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

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    time--;
  };

  let time = 120;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};


const displayMovements = function(accs, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? accs.movements.slice().sort((a, b) => a - b) : accs.movements;

    movs.forEach(function (mov, i){
      const type = mov > 0 ? 'deposit' : 'withdrawal'

      const date = new Date(accs.movementsDates[i]);
      const displayDate = formatMovementDate(date, accs.locale);

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
  labelSumOut.textContent = `$${Math.abs(outcome).toFixed(2)}`;

  const interest = accs.movements.filter(mov => mov > 0).map(deposit => (deposit * accs.interestRate) / 100)
                  .filter((int) => int >= 1).reduce((cur, mov) => cur + mov, 0);
  labelSumInterest.textContent = `$${interest.toFixed(2)}`;
}



let currentAccount, timer;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`;
    containerApp.style.visibility = 'visible';
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

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
      clearInterval(timer);
      timer = startLogOutTimer();
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
    setTimeout(function(){
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      updateUi(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1000);
  }
  inputLoanAmount.value = '';
})

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})
