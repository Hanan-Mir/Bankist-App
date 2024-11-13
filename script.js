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
containerMovements.innerHTML='';
//--------------FUNCTION FOR DISPLAYING THE MOVEMENTS FOR OUR APPLICATION----------------------------------
const displayMovements=function(movement){
  containerMovements.innerHTML='';
movement.forEach(function(value,index,mov){

  let type=value>0?"deposit":"withdrawal";
  const transactionElement=`<div class="movements__row">
  <div class="movements__type movements__type--${type}">${index+1} ${type}</div>
  <div class="movements__date">3 days ago</div>
  <div class="movements__value">${value}</div>
</div>
  `
  containerMovements.insertAdjacentHTML('afterbegin',transactionElement);
})

}
//displayMovements(account1.movements);
//------------------------------------COMPUTE USER NAMES----------------------
let calcUserName=function(acc){
  acc.forEach(function(value){
    value.UserName=value.owner.toLowerCase().split(' ').map(el=>el[0]).join('');
  })
}
calcUserName(accounts);
//------------------------------------TOTAL AMOUNT----------------------------
// let totalMovementSum=function(acc){
// acc.accountBalance=acc.forEach(function(value){
//   let sum=0;
//   value.movements.reduce(function(accum,el,index,arr){
//   sum=accum+el;
//   return sum;
// },0)
// labelBalance.textContent=`${value.accountBalance}EUR`;
// })

// }
let totalMovementSum=function(acc){
 acc.balance=acc.movements.reduce((accu,value,index,arr)=>{ return accu+value;
},0)
labelBalance.textContent=`${acc.balance} EUR`;
}

//totalMovementSum(account1);
//-----------------calculate summary----------------------------
const calcSummary=function(acc){
  const deposits=acc.movements.filter(amount=>amount>0).reduce((acc,curVal)=>acc+curVal,0);
  labelSumIn.textContent=`${deposits}`;
  const withdrawls=acc.movements.filter(amount=>amount<0).reduce((acc,currVal)=>acc+currVal,0);
  labelSumOut.textContent=`${withdrawls}`;
  const intrests=acc.movements.filter(amount=>amount>0).map(val=>(val*acc.interestRate)/100).filter(el=>el>=1).reduce((acc,curVal)=>acc+curVal,0);
  labelSumInterest.textContent=`${intrests}`;
}
//calcSummary(account1.movements);
//--------------------------update UI---------------------------
let updateUI=function(acc){
calcSummary(acc);
totalMovementSum(acc);
displayMovements(acc.movements);
}





//-------------------------------------------------------LOGIN FUNCTION----------------------------------
let currentUser;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
currentUser=accounts.find((acc)=>acc.UserName===inputLoginUsername.value)
if(currentUser?.pin===Number(inputLoginPin.value)){
  //change opacity
  containerApp.style.opacity=1;
  //display user Name
  labelWelcome.textContent=`Welcome back ,${currentUser.owner.split(' ')[0]}`
  // remove the login and pin 
  inputLoginPin.value=inputLoginUsername.value='';
  inputLoginPin.blur();
//display movements;
displayMovements(currentUser.movements);
//display summary
calcSummary(currentUser);
//display total movements sum
totalMovementSum(currentUser);
//get array dynamically 
let myArray=Array.from(document.querySelectorAll('.movements__value'),(el)=>Number(el.textContent));
console.log(myArray)
}
})
//----------------------------transfer function-------------------------
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  let amount=Number(inputTransferAmount.value);
  let transferTo=accounts.find(acc=>acc.UserName===inputTransferTo.value);
if(transferTo && currentUser.balance>amount &&transferTo!==currentUser.UserName &&amount >0){
  transferTo.movements.push(amount);
  currentUser.movements.push(amount);
  updateUI(currentUser);
  
}
inputTransferAmount.value=inputTransferTo.value=' ';
})
//--------------------------------delete account---------------
btnClose.addEventListener('click',function(e){
e.preventDefault();
const userPin=Number(inputClosePin.value);
const userCloseName=inputCloseUsername.value;
if(userCloseName===currentUser.UserName && userPin===currentUser.pin){
  let getIndex=accounts.findIndex((acc)=>acc.UserName===userCloseName)
  accounts.splice(getIndex,1);
  containerApp.style.opacity=0;
  
}
inputClosePin.value=inputCloseUsername.value='';
})
//-----------------------------------loan request------------------------------
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  console.log('loan passed');
  const loanAmount=Number(inputLoanAmount.value);
  let checkEligbility=currentUser.movements.some(el=>el>=loanAmount*0.1);
  if(checkEligbility){
    currentUser.movements.push(loanAmount);
    updateUI(currentUser);
  }
})
//--------------------------------sort movements---------------------------------
let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  //console.log('sort clicked');
  if(sorted===false){
    currentUser.movements.sort((a,b)=>a-b);
displayMovements(currentUser.movements);
sorted=true;
  }
  else{
    sorted=false;
    currentUser.movements.sort((a,b)=>b-a);
    displayMovements(currentUser.movements); 
  }
})
// LECTURES
/////////////////////////////////////////////////
//------------------------------------ARRAY METHODS-----------------------------------
const arr1=['a','b','c','d','e'];
//-----------------slice method---------------------------------
console.log(arr1.slice(2));
console.log(arr1.slice(2,4));
console.log(arr1.slice(-1));
console.log(arr1.slice(2,-1));
console.log(arr1.slice(-3));
//------------------splice method------------------------------
//console.log(arr1.splice(-1));
//console.log(arr1.splice(1,3));
console.log(arr1.splice(-3,2));
console.log(arr1.splice(2,0,'hanan','rashid','yawer'));
console.log(arr1);
console.log(arr1.reverse());
console.log(arr1);
const arr2=['yasir','shuail','majid',"Rohan"];
//------------concat method-----------------
let newArray=arr1.concat(arr2);
console.log(newArray);
//--------------join method------------------
let newArr2=arr2.join('+');
console.log(newArr2);
//------------at method--------------------
console.log(newArray.at(2));
//-------------------------forEach method------------------------
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(`--------------FOR LOOP-------------------`);
for (let [index,value] of movements.entries()){
  if(value>0){
    console.log(`Transaction ${index+1}:Amount deposited ${value}`);
  }
  else{
    console.log(`Transaction ${index+1}:Amount withdrew ${Math.abs(value)}`);
  }
}
console.log(`-----------------FOR EACH LOOP---------------------`);
movements.forEach(function(value,ind,mov){
  if(value>0){
    console.log(`Transaction ${ind+1}:Amount deposited ${value}`);
  }
  else{
    console.log(`Transaction ${ind+1}:Amount withdrew ${Math.abs(value)}`);
  }
})
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
//-----------forEach for maps----------------
currencies.forEach(function(value,key,map){
  console.log(`${key}:${value}`);
})
//-------forEach for sets------------------
let mySet =new Set(['a','b','c','a','a','a']);
console.log(mySet);
mySet.forEach(function(value,key,mySet){
  console.log(`${key}:${value}`)
})
//-------------------------------------CODING CHALLENGE #1-------------------------------
let checkDogs=function(arr1,arr2){
  let newDogsArray=arr1.slice(1);
  console.log(newDogsArray);
newDogsArray=newDogsArray.slice(0,2);
console.log(newDogsArray);
let allDogsArray=newDogsArray.concat(arr2);
allDogsArray.forEach(function(value,index,arr){
  if(value>=3){
    console.log(`Dog number ${index+1} is an adult, and is ${value} years old`)
  }
  else{
    console.log(`Dog number ${index +1} is still a puppy`)
  }
})
}
let dogsJulia=[3,5,2,12,7];
let dogsKate=[4,1,15,8,3];
checkDogs(dogsJulia,dogsKate);
//----------------------------------MAP METHOD----------------------
const transactions=[100,2000,600,900,-1000,900,-8000,-5560];
const euroToRs=100;
const movementsRs=transactions.map((value)=>{
  return value*euroToRs;
})
console.log(movementsRs);
//-----------by for loop
console.log(`--------using for loop------------`);
const movementRsFor=[];
for(let [i,v] of transactions.entries()){
  movementRsFor.push(v*euroToRs);
}
console.log(movementRsFor);

let movementsDescription=transactions.map((value,index)=>{
  return `Transaction ${index +1}:You ${value>0?"DEPOSITED":"WITHDREW"} ${value}`;
})
console.log(movementsDescription);
//-------------------------------------coding challenge #2--------------------------
let calcAverageHumanAge=function(dogAges){
  console.log(dogAges);

  // dogAges.filter(function(value){
  //   if(value<=2){
  //    humanAge.push(value*2);
  //   }
  //   if(value>2){
  //     humanAge.push(16+value*4);
  //   }
   let humanAge=dogAges.map(value=>(value<=2)? value*2:16+value*4);
   console.log(humanAge);
   humanAge=humanAge.filter(value=>value>=18);
   console.log(humanAge);
   let average=humanAge.reduce((accum,value,index,arr)=>{
      return accum+value;
   },0)/humanAge.length;
   console.log(average);
  }
let calcAverageHumanAge2=function(dogagesArray){
  let length;
  let humanAge=dogagesArray.map(value=>(value<=2)? value*2:16+value*4).filter(ages=>{
     return ages>=18}).reduce((acc,val,index,arr)=>{

    return acc+val/arr.length},0);
    console.log(humanAge);
}
  

let dogsage=[5,2,4,1,15,8,3]
calcAverageHumanAge(dogsage);
calcAverageHumanAge2(dogsage);
 //----------------------------------------------Find Method---------------------------------
 let findAccount=function(accou){
 accou.find(function(acc){
if(acc.owner==='Jessica Davis'){
console.log(acc);
}
 })
 }
findAccount(accounts);
let findAccount2=function(acc){
  for(let val of acc){
    if(val.owner==='Sarah Smith'){
      console.log(val);
  }
}
}
findAccount2(accounts);
//----------------------------FLAT AND FLATMAP------------------------------------------
let newMovement=[1000,5000,-799,5000];
let isDeposits=newMovement.some(el=>el>0);
console.log(isDeposits);
//--------------------------reduce method usecases---------------------------------------
// const allMovements=accounts.map(el=>el.movements).flat();
const allMovements=accounts.flatMap(el=>el.movements);
const depositSum=allMovements.filter(el=>el>0).reduce((acc,cur)=>acc+cur,0);
const withDrawlSum=allMovements.filter(el=>el<0).reduce((acc,cur)=>acc+cur,0);
console.log(allMovements);
console.log(depositSum);
console.log(withDrawlSum);
//count number of deposits
const depositNumbers=allMovements.filter(el=>el>0).reduce((count,cur)=>count+1,0)
const withdrawlNumber=allMovements.reduce((count,cur)=>cur<0?count+1:count,0);
console.log(depositNumbers);
console.log(withdrawlNumber);
//replacing the string characters
const changeTitleCase=function(title){
const exceptions=['an',"the",'a','for','let'];
let changeTitle=title.toLowerCase().split(' ').map(el=>exceptions.includes(el)?el:el[0].toUpperCase()+el.slice(1)).join(' ');

return changeTitle;


}
console.log(changeTitleCase('see am an the for with let the sum Rise In the WEST'));
//------------------------------CODING CHALLENGE #4--------------------------------------------
const dogs=[
  {weight:22,curFood:250,owners:['Alice','Bob']},
  {weight:8,curFood:200,owners:['Matilda']},
  {weight:13,curFood:275,owners:['Sarah','John']},
  {weight:32,curFood:340,owners:['Michael']},
];
//Task1
dogs.forEach(function(el){
el.recommendedFood=el.weight**0.75*28;
})
console.log(dogs);
//Task2
let sarahDog=dogs.find((el)=>el.owners.filter((acc)=>acc==='Sarah'?el:0));
// let sarahDog=el.owners.find((own)=>own==='Sarah');
if(sarahDog){
if(sarahDog.curFood>sarahDog.recommendedFood){
  console.log('Eating too much');
}else{
  console.log("Eating too little");
}
}
//Task 3
const ownersEatTooMuch=dogs.filter((dog)=>dog.curFood>dog.recommendedFood).flatMap((el)=>el.owners);
console.log(ownersEatTooMuch);
const ownersEatTooLittle=dogs.filter((dog)=>dog.curFood<dog.recommendedFood).flatMap((el)=>el.owners);
console.log(ownersEatTooLittle);
//Task 4
console.log(`${ownersEatTooMuch.join(' and ')}'s dog eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dog eat too little!`);
const recommendedDog=dogs.some((el)=>el.curFood===el.recommendedFood);
console.log(recommendedDog);
const okDog=dogs.some((el)=>el.curFood>0.1*el.recommendedFood || el.curFood<0.1*el.recommendedFood);
console.log(okDog);

const OkDogsArray=dogs.filter((el)=>{
if(el.curFood>0.1*el.recommendedFood || el.curFood<0.1*el.recommendedFood){
  return el;
}})
console.log(OkDogsArray);
let sortedDogsArray=dogs.map((el)=>{
  return el;
}).sort((a,b)=>a.recommendedFood-b.recommendedFood);
console.log(sortedDogsArray);
































