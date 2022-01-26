const formatDistanceStrict = require('date-fns/formatDistanceStrict');

let distance = formatDistanceStrict(new Date('1999-12-31'), new Date('2022-01-08T19:49:30.000'), {
  unit: 'day',
  addSuffix: false
})

distance = parseInt(distance);

console.log(distance)

// const format = require('date-fns/format');

// let result = format(new Date('2022-01-23T07:32:00.000'), 'HH:mm')

// console.log(result)
