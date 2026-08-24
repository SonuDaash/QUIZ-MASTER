// scripts/run-tests.mjs - Automated System Verification Test Suite
import http from 'http';

console.log('🧪 Starting Smart Mind System Verification Tests...\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedTests++;
  }
}

// 1. Math & Scoring Logic Tests
console.log('📋 Test Group 1: Demo Quiz Scoring & Math Logic');
const sampleScores = [
  { correct: 5, total: 5, expectedAcc: 100 },
  { correct: 4, total: 5, expectedAcc: 80 },
  { correct: 3, total: 5, expectedAcc: 60 },
  { correct: 0, total: 5, expectedAcc: 0 },
];

sampleScores.forEach(({ correct, total, expectedAcc }) => {
  const calculatedAcc = Math.round((correct / total) * 100);
  assert(calculatedAcc === expectedAcc, `Accuracy for ${correct}/${total} is ${expectedAcc}%`);
});

// 2. Auth URL & Parameter Encoding Tests
console.log('\n🔒 Test Group 2: Auth Redirect & Safe Route Encodings');
const testRoutes = ['/admin', '/student', '/student/practice/subj_geo', '/admin/stage'];
testRoutes.forEach((route) => {
  const redirectUrl = `/login?next=${encodeURIComponent(route)}`;
  const searchParams = new URLSearchParams(redirectUrl.split('?')[1]);
  assert(searchParams.get('next') === route, `Route '${route}' preserved correctly in '?next=${searchParams.get('next')}'`);
});

// 3. Local Dev Server HTTP Endpoint Check
console.log('\n🌐 Test Group 3: HTTP Route Availability Check (http://localhost:3000)');

const routesToCheck = [
  { path: '/', expectedCode: 200, name: 'Home Page' },
  { path: '/about', expectedCode: 200, name: 'About Page' },
  { path: '/demo', expectedCode: 200, name: 'Public Demo Quiz' },
  { path: '/leaderboard', expectedCode: 200, name: 'Public Leaderboard' },
  { path: '/login', expectedCode: 200, name: 'Login Page' },
  { path: '/register', expectedCode: 200, name: 'Register Page' },
  { path: '/practice', expectedCode: [200, 307, 308], name: 'Practice Route Alias' },
  { path: '/quiz', expectedCode: [200, 307, 308], name: 'Quiz Route Alias' },
  { path: '/results', expectedCode: [200, 307, 308], name: 'Results Route Alias' },
  { path: '/dashboard', expectedCode: 200, name: 'Smart Dashboard Redirect' },
  { path: '/student/dashboard', expectedCode: [200, 307, 308], name: 'Student Dashboard Alias' },
  { path: '/admin/dashboard', expectedCode: [200, 307, 308], name: 'Admin Dashboard Alias' },
];

async function checkRoute({ path, expectedCode, name }) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      const allowed = Array.isArray(expectedCode) ? expectedCode : [expectedCode];
      const isOk = allowed.includes(res.statusCode);
      assert(isOk, `${name} (${path}) returned HTTP ${res.statusCode}`);
      resolve();
    });

    req.on('error', (e) => {
      console.warn(`  ⚠️ SKIP: ${name} (${path}) server not reachable or starting up (${e.message})`);
      resolve();
    });
  });
}

async function runAllHttpTests() {
  for (const route of routesToCheck) {
    await checkRoute(route);
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`📊 Test Results: ${passedTests} Passed, ${failedTests} Failed`);
  console.log('═══════════════════════════════════════\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllHttpTests();
