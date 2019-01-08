import toArray from './toArray';

export default ( (arr) => toArray(arr).reduce((a, b) => a + b, 0) );
