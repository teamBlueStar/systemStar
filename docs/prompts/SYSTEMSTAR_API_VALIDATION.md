You are the backend development AI for systemStar. Your task is to validate and harden the REST API for BlueTrack Android integration.

OBJECTIVE:
Ensure all API endpoints follow the contract below and are production-ready for mobile consumption. Focus on: auth flow, session cookies, data types, error handling.

ENDPOINTS TO VALIDATE & TEST:

1. POST /api/auth/login
   Input: { email: string, password: string }
   Output: { user: { id: number, name: string, email: string, role: string, clientId: number | null } }
   Side effect: Set-Cookie bluestar.sid (httpOnly, secure in production)
   Test: curl -X POST http://localhost:3000/api/auth/login -d '{"email":"test@example.com","password":"pass123"}' -H "Content-Type: application/json" -c cookies.txt

2. GET /api/auth/me
   Input: (uses bluestar.sid cookie from request)
   Output: { user: { id, name, email, role, clientId } }
   Error: 401 if unauthenticated or cookie missing
   Test: curl http://localhost:3000/api/auth/me -b cookies.txt

3. POST /api/auth/logout
   Input: (uses cookie)
   Output: { ok: true }
   Side effect: Clear-Cookie bluestar.sid
   Error: 401 if not authenticated
   Test: curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt

4. GET /api/fleet/vehicles
   Input: (uses cookie, optional filter by clientId)
   Output: [ { id: number, clientId: number, name: string, plate: string, status: string, speed: number, lat: number, lng: number, address: string | null, lastSeen: string | null (ISO-8601), deviceId: number | null, homologationStatus: string } ]
   Constraints:
   - status must be ENUM: "moving" | "idle" | "offline" | "alarm" (NOT "En movimiento")
   - lat and lng must be NUMBER type, not string
   - lastSeen must be ISO-8601 UTC format or null
   - Empty array [] if no vehicles
   Error: 401 if not authenticated
   Test: curl http://localhost:3000/api/fleet/vehicles -b cookies.txt | jq .

VALIDATION TASKS (Do ALL):

1. Run auth flow test script:
   - POST login with valid credentials -> verify 200 + Set-Cookie header
   - GET /auth/me with cookie -> verify 200 + user data
   - POST logout with cookie -> verify 200
   - GET /auth/me without cookie -> verify 401

2. Verify data types in /api/fleet/vehicles:
   - lat/lng are numbers (test: typeof lat === 'number')
   - status is one of ["moving", "idle", "offline", "alarm"]
   - lastSeen is ISO-8601 or null (not timestamp)
   - All required fields present for each vehicle

3. Test CORS headers:
   - Access-Control-Allow-Origin: * (or specific origin)
   - Access-Control-Allow-Credentials: true
   - Access-Control-Allow-Methods: GET, POST, OPTIONS
   - Test with curl: -H "Origin: http://localhost:3000"

4. Session persistence test:
   - Login -> store cookie
   - Make 5 consecutive /fleet/vehicles requests with cookie
   - Verify all succeed with same data
   - Logout -> next request returns 401

5. Error handling:
   - Invalid email/password -> 401 with { error: "..." }
   - Missing required fields in login -> 400 with { error: "..." }
   - Expired/invalid cookie -> 401
   - Non-existent endpoint -> 404

DELIVERABLES (Create in repo):

1. tests/integration/systemstar-bluetrack-contract.sh
   Bash script that runs all curl tests above. Should output:
   ✓ Login successful
   ✓ Auth/me returns user
   ✓ Logout successful
   ✓ Vehicle list has correct data types
   ✓ CORS headers present
   ✓ Session persists across 5 requests
   ✓ Invalid credentials return 401

2. docs/API_VALIDATION_REPORT.md
   Document any deviations from contract above. If none, state: "All endpoints match BlueTrack integration contract."

3. Test data in database:
   - 1 test user: email=test@bluetrack.local, password=test123, active=true
   - 1 test client: id=1, name="Test Fleet", plan="Premium"
   - 3 test vehicles linked to client 1:
     * id=1, plate=TEST001, status=moving, speed=45, lat=19.4326, lng=-99.1332
     * id=2, plate=TEST002, status=idle, speed=0, lat=20.1234, lng=-100.5678
     * id=3, plate=TEST003, status=offline, speed=0, lat=18.9876, lng=-98.7654

ACCEPTANCE CRITERIA:
- [ ] All 4 endpoints respond with correct HTTP status
- [ ] Session cookie persists and works across requests
- [ ] Data types match contract (numbers, enums, ISO dates)
- [ ] CORS allows credentials
- [ ] curl test script passes all checks
- [ ] 401 returned for unauthenticated requests
- [ ] Test data loads successfully

TIME ESTIMATE: 4-6 hours
STATUS: Ready to assign
PRIORITY: BLOCKING (BlueTrack cannot proceed without this)