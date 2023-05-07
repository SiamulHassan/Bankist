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
  movementsDates: [
    '2023-04-22T16:33:06.386Z',
    '2023-04-27T14:43:26.374Z',
    '2023-04-28T18:49:59.371Z',
    '2023-04-29T12:01:20.894Z',
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
  ],
  currency: 'BDT',
  locale: 'bn-BD',
  // locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2023-04-22T16:33:06.386Z',
    '2023-04-27T14:43:26.374Z',
    '2023-04-28T18:49:59.371Z',
    '2023-04-29T12:01:20.894Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// DATE FUNCTIONALITY ::: my way
// fri/april/28/2023, hour:min
const dayName = new Array(
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
);
const monName = new Array(
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
);
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelDateME = document.querySelector('.dateME');
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
// DAYS PASSED
const formateMovDates = (date, currAcc) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  // akta date amra 'date parameter' theke pabo ar arekta date amra 'new Date' thke pabo
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed === 2) return '3 days ago';
  // akhane uporer sob valu e lass than 7 But return use korar karone jokhon uporer 1 no ta true hobe se porer '*kono*' code e i ashbe na. that means Yesterday se read o korbe na. Same for rest of them even return `${movDate}/${movMonth}/${movYear}`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // console.log('from dayPassed', calcDaysPassed(new Date(), date));
  // const movDate = `${date.getDate()}`.padStart(2, 0);
  // const movMonth = `${date.getMonth() + 1}`.padStart(2, 0);
  // const movYear = date.getFullYear();
  // return `${movDate}/${movMonth}/${movYear}`;
  return new Intl.DateTimeFormat(currAcc.locale).format(date);
};
/////////////////////////////////////////////////
// FUNCTION FOR Currency FORMATING
const formatNum = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// DISPLAY MOVEMENTS
const displayMovements = (currAcc, sorted = false) => {
  // console.log(currAcc);
  containerMovements.innerHTML = '';
  // sorted by ascending order
  // slice is use for preventing the mutation of the original array
  const mov = sorted
    ? currAcc.movements.slice().sort((a, b) => a - b)
    : currAcc.movements;
  mov.forEach((mov, i) => {
    const formatMov = formatNum(mov, currAcc.locale, currAcc.currency);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const now = new Date(currAcc.movementsDates[i]);
    const movDates = formateMovDates(now, currAcc);
    const accMov = `
    <div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${movDates}</div>
     <div class="movements__value">${formatMov}</div>
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
  // labelSumIn.textContent = `${income.toFixed(2)}€`;
  labelSumIn.textContent = formatNum(income, acc.locale, acc.currency);
  // outcome
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, currMov) => acc + currMov, acc.movements.at(0));
  // labelSumOut.textContent = `${Math.abs(outcome)}€`;
  labelSumOut.textContent = formatNum(
    Math.abs(outcome),
    acc.locale,
    acc.currency
  );
  //INTEREST: only calculate for diposite,on each diposit interest rate is 1.2%
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, dep) => acc + dep, 0);
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = formatNum(interest, acc.locale, acc.currency);
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
  //`${balance.toFixed(2)}€`;
  labelBalance.textContent = formatNum(balance, acc.locale, acc.currency);
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// UPDATING UI
const updateUI = currentAcc => {
  // display movements
  displayMovements(currentAcc);
  //display balance
  calcDisplayBalance(currentAcc);
  //display summary
  displaySummary(currentAcc);
};
/////////////// logout timer
const logOutTimer = () => {
  // set time to 5 min
  let time = 10;
  //call the tiemr every sec

  // sec o hole logout
  const tickTimer = () => {
    //in each call print the remaining time
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    // check if it reaches 0
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'login again';
      containerApp.style.opacity = 0;
    }
    // decrease it
    time--;
  };
  tickTimer();
  //diffrent account at the same time time count korte thake. so kono account jokhon login korbe amra check korbo je kono timer on ache kina. on thakle seta off korbo. off(clearInterval) korar jonno OR chalu korar jonno 'timer' var ke dorkar. so we need to return it
  let timer = setInterval(tickTimer, 1000);
  return timer;
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LOGIN FUNCTIONALITY
let currentAcc, timer;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if (currentAcc?.pin === +inputLoginPin.value) {
    // welcome message
    labelWelcome.textContent = `Welcome back! ${currentAcc.owner
      .split(' ')
      .at(0)}`;
    // display ui
    containerApp.style.opacity = 1;
    updateUI(currentAcc);
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    // DATE FUNCTIONALITY ::: jonas way
    // day/month/year, hour:min
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAcc.locale,
      options
    ).format(now);
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    // cursor blinking stopping or focus stopping ::: blur()
    inputLoginPin.blur();
    // if already has a timer, we will clear it
    if (timer) {
      clearInterval(timer);
    }
    // jodi ager acc er timer thake taile clear hobe + 308 line er code new je login korbe tar timer count start korbe
    // logOutTimer fun e timer ache. login korle amra faka var timer er value te logOutTimer call kortesi. so logOutTimer theke timer er value 'timer var e store thakbe.
    timer = logOutTimer();
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//TRANSFER BALANCE
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
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
    // pusign dates
    const movDate = new Date().toISOString();
    currentAcc.movementsDates.push(movDate);
    receiverAcc.movementsDates.push(movDate);
    //updating UI
    updateUI(currentAcc);
    // rest timer ::: it means clear the time and count form start agin
    clearInterval(timer);
    timer = logOutTimer();
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
//REQUEST LOAN
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  const isAnyTenPercent = currentAcc.movements.some(mov => mov >= mov / 10);
  if (amount > 0 && isAnyTenPercent) {
    // add positive movements to the acc
    currentAcc.movements.push(amount);
    // new Date() works just fine but we want to keep same formate as in movementsDates array so .isoString()
    currentAcc.movementsDates.push(new Date().toISOString());
    //update ui
    updateUI(currentAcc);
    // reset input
    inputLoanAmount.value = '';
    clearInterval(timer);
    timer = logOutTimer();
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
//DELET ACCOUNT
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAcc.userName &&
    +inputClosePin.value === currentAcc.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAcc.userName
    );
    accounts.splice(index, 1);
    // logout:Hide UI
    containerApp.style.opacity = 0;
    // empty input fields
    inputCloseUsername.value = inputClosePin.value = '';
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
//SORTING MOVEMENTS
// here sorted is a state variable wich value will be reversed on onclick
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAcc, !sorted);
  // reversing or reAssigning sorted var value
  sorted = !sorted;
});

////////////////////////////////////////////////////////
/////////////////// Lectures
const random = (min, max) => Math.trunc(Math.random() * (max - min) + 1) + min;
// console.log(random(10, 20));
// explaining random function
// const random = (min, max) => {
//   const randomDecimal = Math.random();
//   console.log('randomDecimal', randomDecimal);

//   const difference = max - min;
//   console.log('diffrence', difference);

//   const scaledRandom = randomDecimal * difference;
//   console.log('scaledRandom', scaledRandom);

//   const truncatedRandom = Math.trunc(scaledRandom);
//   console.log('truncatedRandom', truncatedRandom);

//   const shiftedRandom = truncatedRandom + 1;
//   const finalResult = shiftedRandom + min;
//   return finalResult;
// };

console.log('Finall', random(10, 20));
// Rounding decimal ;;; toFixed returns string not number, you need to convert it
console.log((2.7).toFixed(1));
console.log((2.4).toFixed(1));
// arg 0 er khetre ata round() er moto kaj kore

////////////////////////////////////////////////
//// DATE AND CALCULATION: DURATION BETWEEN TOW DATES, COUNTING TIMES ...
const today = new Date(2037, 3, 14);
console.log(+today);
// you will get minus value if you passed 28 first and 14 last so Math.abs it
const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
const day1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 28));
console.log('day1', day1);

/////////////////////////////////////////
/// Internationalization
const options = {
  day: 'numeric', //indicates date
  month: '2-digit', // numeric
  weekday: 'short', // long (Friday), short (Fri), or narrow (F).
  // date: 'numeric', ata kaj kore na ba dorkar nai
  year: 'numeric',
  hour: '2-digit', // numeric
  minute: '2-digit', // numeric :: dont write min
  // also available
  // hour12: false,
  // timeZone: 'America/Los_Angeles',
  // timeZoneName: 'short',
};
const now = new Date();
// const local = navigator.language;
// console.log(local); // en-US
const intl = new Intl.DateTimeFormat('bn-BD', options).format(now);
// const intl = new Intl.DateTimeFormat('en-US', options).format(now);
console.log(intl); // 4/29/2023
//////////////////////////////
// Clock
setInterval(() => {
  const now = new Date();
  let hour = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();
  // console.log(`${hour}:${min}:${sec - 1}`);
}, 1000);
// Set the date we're counting down to
let countDownDate = new Date('may 6, 2023 13:00:00').getTime();

// Get today's date and time
let today5 = new Date().getTime('may 5, 2023 13:00:00');

// Find the distance between now and the count down date
let distanceWithMiliSec = countDownDate - today5;
console.log('distance', distanceWithMiliSec);
// 1000 mili sec = 1 sec
let second = distanceWithMiliSec / 1000;
//let min = distanceWithMiliSec / 1000 * 60;
//let hour = distanceWithMiliSec / 1000 * 60 * 60;
//let day = distanceWithMiliSec / 1000 * 60 * 60 * 24;
/////////////////////////// thinking another way
// day ke vag korar pore ja oboshistho thakbe(%) seta holo hour
// ...........let hour = distanceWithMiliSec % 1000 * 60 * 60 * 24;
// hour ke vag korar pore ja oboshistho thakbe(%) seta holo min
//...........let min = distanceWithMiliSec % 1000 * 60 * 60 ;(reminder of hours is gonna be min)
// min ke vag korar pore ja oboshistho thakbe(%) seta holo sec
//...........let sec = distanceWithMiliSec % 1000 * 60  ;(reminder of min is gonna be sec)

// 60 sec = 1 min
let minute = second / 60;
// 60 min = 1 hour
let hours = minute / 60;
// 24h = 1 day
let days = hours / 24;
console.log('days', days);
console.log('hours', hours);
console.log('minute', minute);
console.log('second', second);
// // Update the count down every 1 second
// var x = setInterval(function() {

//   // Get today's date and time
//   var now = new Date().getTime();

//   // Find the distance between now and the count down date
//   var distance = countDownDate - now;
// })
