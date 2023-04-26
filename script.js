'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// DISPLAY MOVEMENTS

const displayMovements = movements => {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const accMov = `
    <div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__value">${mov}€</div>
  </div>
`;
    containerMovements.insertAdjacentHTML('afterbegin', accMov);
  });
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// CREATING USER NAMES
//(mutating original obj by creating new property of accounts{side effects})
const createUserNames = accs => {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.at(0))
      .join('');
  });
};
createUserNames(accounts);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// DISPLAY SUMMARY:INCOEM,OUTCOME,INTEREST
const displaySummary = acc => {
  //movements parameter changed to acc for needing the whole account access in order to access the interest rate porperty cause every account has diffrent rate
  //income
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, currMov) => acc + currMov, acc.movements.at(0));
  labelSumIn.textContent = `${income}€`;
  // outcome
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, currMov) => acc + currMov, acc.movements.at(0));
  labelSumOut.textContent = `${Math.abs(outcome)}€`;
  //INTEREST: only calculate for diposite,on each diposit interest rate is 1.2%
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, dep) => acc + dep, 0);
  labelSumInterest.textContent = `${interest}€`;
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// DISPLAY BALANCE
const calcDisplayBalance = acc => {
  const balance = acc.movements.reduce(
    (acc, mov) => acc + mov,
    acc.movements.at(0)
  );
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// UPDATING UI
const updateUI = currentAcc => {
  // display movements
  displayMovements(currentAcc.movements);
  //display balance
  calcDisplayBalance(currentAcc);
  //display summary
  displaySummary(currentAcc);
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LOGIN FUNCTIONALITY
let currentAcc;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    // welcome message
    labelWelcome.textContent = `Welcome back! ${currentAcc.owner
      .split(' ')
      .at(0)}`;
    // display ui
    containerApp.style.opacity = 1;
    updateUI(currentAcc);
    // reseting inputs
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    // cursor blinking stopping or focus stopping ::: blur()
    inputLoginPin.blur();
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
//TRANSFER BALANCE
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    currentAcc.balance >= amount &&
    receiverAcc &&
    receiverAcc.userName !== currentAcc.userName
  ) {
    //transfering money
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //updating UI
    updateUI(currentAcc);
  }
});
