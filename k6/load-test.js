import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },  // Ramp-up to 5 virtual users
    { duration: '20s', target: 10 }, // Stay at 10 virtual users
    { duration: '10s', target: 0 },  // Ramp-down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests must complete below 1000ms
    http_req_failed: ['rate<0.05'],    // Error rate must be less than 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // 1. Test Main Page (Catalog / AtelierFlow Home)
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    'home status is 200': (r) => r.status === 200,
    'home response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  // 2. Test Login Page
  const loginRes = http.get(`${BASE_URL}/login`);
  check(loginRes, {
    'login page status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
