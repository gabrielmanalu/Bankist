'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Gabriel Manalu',
  movements: [230, 440, -10, 3000, -750, -170, 420, 134],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function(accs) {
  containerMovements.innerHTML = '';
    accs.movements.forEach(function (mov, i){
      const type = mov > 0 ? 'deposit' : 'withdrawal'
      const html =  `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
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
  labelSumInterest.textContent = `$${interest}`;
}



let currentAccount;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`;
    containerApp.style.visibility = 'visible';
    displayMovements(currentAccount);
    displayBalance(currentAccount);
    displaySummary(currentAccount);
  }
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// const julia = [[3, 5, 2, 12, 7],[9, 16, 6, 8, 3]]
// const kate = [[4, 1, 15, 8, 3],[10, 5, 6, 1, 4]]

// const checkDogs = (arr1, arr2) => {
//   const dogsJuliaCorrected = arr1.slice();
//   dogsJuliaCorrected.splice(0,1);
//   dogsJuliaCorrected.splice(-2);
//   const dogs = dogsJuliaCorrected.concat(arr2);
//   dogs.forEach(function(dog, i){
//     const dogsOrPuppy = dog >= 3 ? 'an adult' : 'still a puppy 🐶'
//     console.log(`Dog number ${i} is ${dogsOrPuppy} and is ${dog} years old`);
//   })
// }

// checkDogs(julia[0], kate[0]);
// checkDogs(julia[1], kate[1])


// const calcAverageHumanAge = arr =>
//   arr.map((age) => age > 2 ? 16 + (age * 4) : age * 2 )
//   .filter((age) => age >= 18)
//   .reduce((cur, age, i, arrays) => cur + age / arrays.length, 0);


// const a = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(a);
