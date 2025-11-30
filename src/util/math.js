/**
 * Determines whether the given number is prime.
 * @param {number} n
 * @returns {boolean}
 */
export function isPrime(n) {
  if ((n % 1) !== 0) return false;
  if (n < 2) return false;
  if (n === 2) return true;
  if ((n % 2) === 0) return false;
  const end = Math.trunc(Math.sqrt(n) + 1);
  for (let z = 3; z < end; z+=2) {
    if ((n % z) === 0) return false;
  }
  return true;
}

/**
 * Gets a list of primes up to and including the given number.
 * @param {number} n
 * @returns {number[]}
 */
export function getPrimes(n) {
  const result = [];
  if (n < 2) return result;
  result.push(2);
  process.stdout.write('2');
  for (let z = 3; z <= n; z+=2) {
    const pEnd = Math.trunc(Math.sqrt(z) + 1);
    let composite = false;
    for (const p of result) {
      if (p > pEnd) break;
      if ((z % p) === 0) {
        composite = true;
        break;
      }
    }

    if (!composite) {
      result.push(z);
      process.stdout.write(`,${z}`);
    }
  }

  process.stdout.write('\n');
  return result;
}

const N = 1<<24;
const start = Date.now();

const result = getPrimes(N);
// const result = [];
// for (let n = 0; n < N; n++) {
//   if (isPrime(n)) {
//     result.push(n);
//   }
// }

const end = Date.now();
// console.log(result.join(','));

console.log(`Found ${result.length} primes from 2 to ${N} in ${end - start}ms.`);

// const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

// let falsePos = 0;
// let falseNeg = 0;
// for (let n = -100; n <= 100; n++) {
//   const actual = isPrime(n);
//   const expected = primes.includes(n);
//   if (actual && !expected) {
//     falsePos++;
//     console.log(`❌ False positive: isPrime(${n}) -> TRUE (expected FALSE)`);
//   } else if (!actual && expected) {
//     falseNeg++;
//     console.log(`❌ False negative: isPrime(${n}) -> FALSE (expected TRUE)`);
//   }
// }
// if (falseNeg === 0 && falsePos === 0) {
//   console.log(`✅ Test passed!`);
// }
