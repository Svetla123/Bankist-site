'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Luka Svetlečić',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov >= 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (account) {
  const incoms = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incoms}`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} `;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    //we are in specific acc
    acc.username = acc.owner //modifining a object with new proerties
      .toLowerCase()
      .split(' ')
      .map(value => value[0])
      .join('');
    //return we are now writing
  });
};
createUsernames(accounts);

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, value) => acc + value, 0);
  labelBalance.textContent = `${account.balance} EUR`;
};

const updateUI = function (account) {
  //display sumery
  calcDisplaySummary(account);
  //display balance
  calcDisplayBalance(account);
  //display movments
  displayMovements(account.movements);
};

//Event handlers
let currentAcount;
btnLogin.addEventListener('click', function (event) {
  //prevent form from submiting
  event.preventDefault();

  currentAcount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAcount?.pin === Number(inputLoginPin.value)) {
    //displey UI and massage
    labelWelcome.textContent = `Welcome beck, ${
      currentAcount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100; //make disaper and make it back (UI)

    //clear input fileds
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur(); //lose focus from mouse cours

    updateUI(currentAcount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAccount = accounts.find(
    //we find acc
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    reciverAccount &&
    currentAcount.balance >= amount &&
    reciverAccount.username !== currentAcount.username
  ) {
    currentAcount.movements.push(-amount);
    reciverAccount.movements.push(amount);
    updateUI(currentAcount);
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAcount.movements.some(mov => mov >= amount * 0.1)) {
    //Add movement
    currentAcount.movements.push(amount);
    //update UI
    updateUI(currentAcount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  const closePin = Number(inputClosePin.value);
  const closeUsername = inputCloseUsername.value;

  inputCloseUsername.value = inputClosePin.value = '';

  if (
    closeUsername === currentAcount.username &&
    closePin === currentAcount.pin
  ) {
    //DELETING ACCOUNT
    const index = accounts.findIndex(
      //we get a index we get only a first value
      acc => acc.username === currentAcount.username
    );
    accounts.splice(index, 1); //splice will muted a original array

    //HIDE UI
    containerApp.style.opacity = 0;
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcount.movements, !sorted);
  sorted = !sorted;
});

