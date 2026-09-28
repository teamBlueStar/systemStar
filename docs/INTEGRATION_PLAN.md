# systemStar ↔ BlueTrack Integration Plan

## Overview

This document defines the 3-layer integration between **systemStar** (backend) and **BlueTrack Android** (mobile client). Each layer has specific responsibilities and AI-generated prompts to execute the work.

---

## Layer 1: API Contract Definition

**Owner:** systemStar team  
**Status:** Ready for validation  
**Deliverable:** Verified OpenAPI spec + TypeScript DTOs

### Current State
- OpenAPI 3.1.0 spec exists at `bluestar-platform/lib/api-spec/openapi.yaml`
- Auth routes implemented: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- Fleet routes implemented: `GET /api/fleet/vehicles`, `POST /api/fleet/vehicles`, DELETE, etc.
- Session-based auth via `bluestar.sid` cookie

### Validation Checklist
- [ ] `/api/auth/login` returns `{ user: { id, name, email, role, clientId } }`
- [ ] `/api/auth/me` returns current session or 401
- [ ] `/api/auth/logout` clears session
- [ ] `/api/fleet/vehicles` returns array of `FleetVehicle` with all required fields
- [ ] All responses use consistent field naming (camelCase)
- [ ] All timestamps are ISO-8601 UTC
- [ ] Numeric coordinates: `lat`, `lng` are numbers, not strings
- [ ] `status` enum: `"moving" | "idle" | "offline" | "alarm"`
- [ ] CORS headers allow credentials: `credentials: true`

### AI Prompt for systemStar Backend Team

**File:** `docs/prompts/SYSTEMSTAR_API_VALIDATION.md`

```
You are responsible for validating and hardening the systemStar REST API 
for BlueTrack Android integration.

OBJECTIVE:
Ensure all API endpoints follow the contract below and are production-ready 
for mobile consumption.

ENDPOINTS TO VALIDATE:

1. POST /api/auth/login
   Input: { email: string, password: string }
   Output: { user: { id: number, name: string, email: string, role: string, clientId: number | null } }
   Side effect: Set-Cookie bluestar.sid
   
2. GET /api/auth/me
   Input: (uses cookie)
   Output: { user: {...} }
   Error: 401 if unauthenticated
   
3. POST /api/auth/logout
   Output: { ok: true }
   Side effect: Clear-Cookie bluestar.sid
   
4. GET /api/fleet/vehicles
   Input: (uses cookie + optional clientId filter)
   Output: [{ id, clientId, name, plate, status, speed, lat, lng, address, lastSeen, deviceId, homologationStatus }]
   Constraints:
   - status must be "moving" | "idle" | "offline" | "alarm"
   - lat/lng must be numbers
   - lastSeen must be ISO-8601 or null

TASKS:
1. Test each endpoint with curl/Postman
2. Verify session cookie persistence across requests
3. Ensure 401 is returned when cookie expires or is missing
4. Confirm CORS allows credentials (Access-Control-Allow-Credentials: true)
5. Verify field types match the contract above
6. Document any deviations in SYSTEMSTAR_API_DEVIATIONS.md
7. Create test data: 1 user, 1 client, 3 vehicles with positions

DELIVERABLE:
A passing curl script at tests/integration/auth-fleet-flow.sh that:
- Logs in
- Fetches vehicles
- Logs out
- Confirms logout
```

---

## Layer 2: Android HTTP Client + Session Management

**Owner:** BlueTrack Android team  
**Status:** To be implemented  
**Deliverable:** `SystemStarApiClient.kt` + cookie-based auth

### Architecture

```
MainActivity
    ├── LoginViewModel (uses AuthRepository)
    │   └── SystemStarAuthRepository
    │       └── SystemStarApiClient
    │           └── OkHttpClient + CookieJar
    │
    └── FleetViewModel (uses VehicleRepository)
        └── SystemStarVehicleRepository
            └── SystemStarApiClient
```

### Files to Create

1. **`app/src/main/java/com/bluestar/bluetrack/data/remote/SystemStarApiClient.kt`**
   - HTTP client with automatic cookie management
   - Login, getVehicles, logout methods
   - Error handling and retry logic

2. **`app/src/main/java/com/bluestar/bluetrack/data/repository/SystemStarAuthRepository.kt`**
   - Implements `AuthRepository` interface
   - Maps API response to `Session` domain model
   - Handles auth errors

3. **`app/src/main/java/com/bluestar/bluetrack/data/repository/SystemStarVehicleRepository.kt`**
   - Implements `VehicleRepository` interface
   - Transforms `FleetVehicle` DTO to `Vehicle` domain model
   - Status enum translation

4. **`app/src/main/java/com/bluestar/bluetrack/data/remote/dto/FleetVehicleDto.kt`**
   - Data class for API response deserialization

### AI Prompt for BlueTrack Android Team

**File:** `docs/prompts/BLUETRACK_API_CLIENT.md`

```
You are responsible for implementing the systemStar HTTP client for BlueTrack Android.

OBJECTIVE:
Create a production-grade REST client that:
- Manages session cookies automatically
- Translates API responses to domain models
- Handles auth errors (401, 403)
- Supports configurable base URL

CONSTRAINTS:
- Use OkHttpClient (already in build.gradle via androidx deps)
- Session auth via Cookie, NOT Bearer token
- No Retrofit/Retrofit required (manual HTTP for simplicity)
- Coroutine-based (suspend functions)
- All network calls in IO dispatcher

LAYER 2A: HTTP CLIENT (SystemStarApiClient.kt)
Location: app/src/main/java/com/bluestar/bluetrack/data/remote/
Responsibilities:
  1. Create OkHttpClient with JavaNetCookieJar for auto cookie mgmt
  2. POST /api/auth/login(email, password) -> JSON response
  3. GET /api/auth/me -> JSON response
  4. POST /api/auth/logout -> JSON response
  5. GET /api/fleet/vehicles -> JSON array
  6. Parse JSON responses (use org.json or Gson)
  7. Handle HTTP errors:
     - 401 -> throw AuthenticationException
     - 4xx -> throw HttpException
     - 5xx -> throw ServerException
  8. Add configurable baseUrl + timeout

Code skeleton:
  class SystemStarApiClient(baseUrl: String = "http://localhost:3000") {
    private val cookieManager = CookieManager()
    private val httpClient = OkHttpClient.Builder()
      .cookieJar(JavaNetCookieJar(cookieManager))
      .connectTimeout(10, TimeUnit.SECONDS)
      .build()
    
    suspend fun login(email: String, password: String): LoginResponse
    suspend fun me(): UserResponse
    suspend fun logout(): Unit
    suspend fun getVehicles(): List<FleetVehicleDto>
  }

LAYER 2B: DATA MODELS (dto/)
Location: app/src/main/java/com/bluestar/bluetrack/data/remote/dto/
Files:
  - LoginResponse.kt (contains User)
  - UserResponse.kt
  - FleetVehicleDto.kt
  - LogoutResponse.kt

LAYER 2C: REPOSITORY IMPLEMENTATIONS
Location: app/src/main/java/com/bluestar/bluetrack/data/repository/
Files:
  1. SystemStarAuthRepository.kt
     - Implements AuthRepository
     - override suspend fun login(username, password): Session?
     - Maps LoginResponse.user -> User domain -> Session
     - Catches AuthenticationException -> return null
  
  2. SystemStarVehicleRepository.kt
     - Implements VehicleRepository
     - override suspend fun getVehicles(): List<Vehicle>
     - Maps List<FleetVehicleDto> -> List<Vehicle>
     - Status translation: "moving"->"En movimiento", "idle"->"Detenido", etc.
     - Handles 401 -> throw or return empty list (TBD)

TESTING:
  1. Create MockSystemStarApiClient for unit tests
  2. Test LoginViewModel with real client + mock systemStar response
  3. Test FleetViewModel with real client + mock vehicle response
  4. Manual integration test: point to staging systemStar + login

INTEGRATION POINT:
  In MainActivity.kt, replace:
    LoginViewModelFactory(MockAuthRepository())
  With:
    val apiClient = SystemStarApiClient("https://systemstar-api.example.com")
    LoginViewModelFactory(SystemStarAuthRepository(apiClient))

DELIVERABLE:
- All 5 files (.kt) compiling without errors
- Unit tests for auth repo (login success, failure, exception)
- Unit tests for vehicle repo (mapping, status translation)
- Manual test script documenting steps to verify with real systemStar
```

---

## Layer 3: Dependency Injection & MainActivity Integration

**Owner:** BlueTrack Android team (after Layer 2)  
**Status:** To be implemented  
**Deliverable:** Updated `MainActivity.kt` using real repos

### Changes Required

**File:** `app/src/main/java/com/bluestar/bluetrack/MainActivity.kt`

```kotlin
// BEFORE (Mock)
loginViewModel = ViewModelProvider(
    this,
    LoginViewModelFactory(MockAuthRepository())
)[LoginViewModel::class.java]

// AFTER (Real)
val apiClient = SystemStarApiClient(
    baseUrl = BuildConfig.SYSTEMSTAR_API_URL
)
loginViewModel = ViewModelProvider(
    this,
    LoginViewModelFactory(SystemStarAuthRepository(apiClient))
)[LoginViewModel::class.java]
```

**File:** `app/build.gradle` - Add to `defaultConfig`

```gradle
buildTypes {
    debug {
        buildConfigField "String", "SYSTEMSTAR_API_URL", '"http://10.0.2.2:3000"' // Android emulator localhost
    }
    release {
        buildConfigField "String", "SYSTEMSTAR_API_URL", '"https://api.systemstar.com"'
    }
}
```

**File:** `app/src/main/AndroidManifest.xml` - Add permissions

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### AI Prompt for BlueTrack Integration Team

**File:** `docs/prompts/BLUETRACK_INTEGRATION.md`

```
You are responsible for integrating systemStar client into BlueTrack's UI layer.

OBJECTIVE:
Replace all MockAuthRepository and MockVehicleRepository with real systemStar 
clients, ensuring the app flows work end-to-end.

PREREQUISITES:
- Layer 2 (SystemStarApiClient, repos, DTOs) is complete and tested

TASKS:

1. UPDATE MainActivity.kt
   - Remove: LoginViewModelFactory(MockAuthRepository())
   - Add: Instantiate SystemStarApiClient with BuildConfig.SYSTEMSTAR_API_URL
   - Pass SystemStarAuthRepository(apiClient) to LoginViewModelFactory
   - Repeat for FleetViewModelFactory + SystemStarVehicleRepository
   - ViewModels and UI remain UNCHANGED

2. UPDATE build.gradle
   - Add buildConfigField for SYSTEMSTAR_API_URL (debug vs release)
   - Debug: http://10.0.2.2:3000 (Android emulator localhost)
   - Release: https://api.systemstar.com (or your prod domain)

3. UPDATE AndroidManifest.xml
   - Add <uses-permission android:name="android.permission.INTERNET" />
   - Verify targetSdk and minSdk are correct (26+)

4. REMOVE MOCK FILES (optional but clean)
   - Delete MockAuthRepository.kt
   - Delete MockVehicleRepository.kt
   - Keep domain interfaces and models

5. ERROR HANDLING
   - LoginViewModel already handles session = null (auth failed)
   - FleetViewModel already handles error state
   - No UI changes needed; error flows work as-is

6. TESTING
   - Compile project: ./gradlew assembleDebug
   - Run on emulator or device
   - Verify logcat for HTTP logs (add OkHttp interceptor if needed)
   - Test flow: Login -> Dashboard -> Logout
   - Check that bluestar.sid cookie is sent with fleet requests

DELIVERABLE:
- MainActivity.kt updated and compiling
- build.gradle with SYSTEMSTAR_API_URL buildConfig field
- AndroidManifest.xml with INTERNET permission
- APK builds successfully
- Manual test report: "Login/Logout/Fleet fetch works with real systemStar"
```

---

## Implementation Timeline

| Phase | Owner | Duration | Deliverable |
|-------|-------|----------|-------------|
| **1. API Contract** | systemStar | 1 day | Validated openapi.yaml + curl test script |
| **2. Android Client** | BlueTrack | 3-4 days | SystemStarApiClient + Repositories + DTOs |
| **3. Integration** | BlueTrack | 1 day | MainActivity updated + full E2E test |
| **Total** | Both | ~1 week | Production-ready BlueTrack-systemStar connection |

---

## Success Criteria

- [ ] BlueTrack can login to systemStar with valid credentials
- [ ] Session cookie persists across API calls
- [ ] Vehicle list loads and displays with real data
- [ ] Logout clears session
- [ ] Invalid credentials show error state
- [ ] App handles 401 (session expired) gracefully
- [ ] APK compiles for API 26+
- [ ] Works on emulator and physical device
- [ ] systemStar logs show successful auth + vehicle queries

---

## Notes

- **GPS backend (TCP)** is not required for this integration. BlueTrack can query static/cached vehicle data from systemStar DB.
- **Real GPS positions** can be added later when `backend/protocols/*` are implemented.
- This plan assumes systemStar is deployed and accessible via HTTP(S).
- For local development: run systemStar on `localhost:3000` and point emulator to `10.0.2.2:3000`.
