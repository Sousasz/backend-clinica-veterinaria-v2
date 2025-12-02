# Copilot Instructions for Veterinary Clinic System

## Architecture Overview

This is a **full-stack veterinary clinic management system** with:
- **Backend**: Node.js/Express (port 5000) with MongoDB via Mongoose
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Material-UI
- Both located in `backend-clinica-veterinaria-v2/` and `frontend-clinica-veterinaria-v2/` directories

### Data Flow Pattern
Routes → Controllers → Services (business logic) → Models (Mongoose schemas) ↔ MongoDB

## Backend Essentials

### Authentication Pattern
- **Token storage**: JWT tokens in `Authorization: Bearer <token>` OR `x-auth-token` headers (both supported)
- **Auth middleware** (`middleware/auth.js`): Decodes token, sets `req.user` from JWT payload
- **JWT payload format**: `{ user: { id: '<userId>', role: 'user|admin' }, ... }`
- **Key services**: `UserService.validateCredentials()` (login), `UserService.createUser()` (register)
- Uses bcryptjs for password hashing

### Service-Oriented Model Layer
Each resource has TWO files:
- **Model** (e.g., `models/Appointment.js`): Mongoose schema definition only
- **Service** (e.g., `models/AppointmentService.js`): Static methods for DB operations (create, read, update, delete)

Example pattern from `AppointmentService`:
```javascript
static async createAppointment(appointmentData) { 
  const newAppointment = new Appointment(appointmentData);
  await newAppointment.save();
  return { success: true, message: '...', appointment: newAppointment, status: 201 };
}
```

### Google Calendar Integration
- Service: `services/googleCalendarService.js` uses JWT (Service Account) auth
- Required env vars: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID`
- Returns `{ id, htmlLink }` on success; gracefully fails if unconfigured
- Used in appointment creation to sync with external calendar

### Critical ENV Variables
```
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_CALENDAR_ID=...
NODE_ENV=development|production
```

### Route Organization
Routes mounted in `server.js` at `/api/<resource>`:
- `/api/auth` - login, register, password reset (OTP support in User model)
- `/api/user` - profile, update user data
- `/api/pets` - pet CRUD (owner-filtered)
- `/api/appointments` - booking, client appointments, admin view all
- `/api/medicines`, `/api/vaccines`, `/api/services`, `/api/consults` - similar CRUD patterns
- `/api/chat` - AI chat (uses OpenAI or Google Generative AI)

Admin routes protected with `auth` + `adminMiddleware`.

## Frontend Essentials

### Context Providers (Root Layout)
- **AuthProvider** (`src/contexts/auth-context.tsx`): User state, login/logout, profile refresh
- **AppointmentsProvider** (`src/contexts/appointments-context.tsx`): Shared appointment state
- Wraps all children in `src/app/layout.tsx`

### Auth Context Pattern
```tsx
const { user, setUser, logout, loading, updateUser } = useContext(AuthContext);
// user has: id, username, role, documentId, phone, cep, addressStreet, etc.
// Tokens stored in localStorage (check context for persistence logic)
```

### Backend URL Configuration
- `src/lib/config.ts`: exports `BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'`
- All API calls: `fetch(`${BACKEND_URL}/api/...`, { headers: { 'x-auth-token': token } })`

### Component Structure
- `src/components/shared/` - Header, Footer, common UI
- `src/components/home/` - Homepage sections
- `src/components/ui/` - Radix-based primitive components
- `src/modals/` - Modal dialogs (booking, medicines, vaccines, rating, sign-in)
- Each modal is a self-contained form component

### Styling Stack
- **Tailwind CSS** + **Tailwind Merge** for utility classes
- **Material-UI (MUI)** for complex components
- **Lucide icons** for SVG icons
- Custom CSS in `src/app/globals.css`

### Key Dependencies
- `next-pwa` for PWA support (manifest + service worker)
- `react-markdown` for displaying formatted text
- `axios` for some API calls (mixed with fetch)
- `date-fns` for date manipulation
- `jwt-decode` for token inspection

## Cross-Stack Patterns

### Appointment Workflow
1. Frontend: Booking modal collects pet, type, date, time, description
2. Backend controller: Verifies pet ownership via JWT `clientId`, creates appointment
3. Google Calendar: Tries to sync; non-blocking if fails
4. Response includes `{ appointment, googleEvent: { id, link } }`
5. Frontend displays confirmation with calendar link

### User/Pet Relationship
- Users own pets (Pet model has `ownerId`)
- Appointments require valid `petId` matching user's pets
- PetService filters by `clientId` (from JWT) before returning

### Error Responses
Backend returns consistent shape:
```json
{ "success": false, "message": "...", "errors": { "field": "error" }, "status": 400 }
```

### CORS Configuration
- Dev: Any origin allowed
- Prod: Whitelist includes `joyce-veterinaria.vercel.app`, `localhost:3000`
- Methods: GET, POST, OPTIONS
- Headers: Content-Type, x-auth-token, Authorization

## Adding New Features

**For a new resource (e.g., "Diagnoses")**:
1. **Backend**:
   - `models/Diagnosis.js` - Mongoose schema
   - `models/DiagnosisService.js` - CRUD methods
   - `controllers/diagnosisController.js` - Route handlers (validate JWT, call service)
   - `routes/diagnosis.js` - Express router (mount in `server.js`)
2. **Frontend**:
   - `src/modals/add-diagnosis/` - Create form modal
   - `src/contexts/` - Add provider if shared state needed
   - Use `BACKEND_URL` + `x-auth-token` in fetch calls

## Running & Debugging

### Backend
- `npm start` → runs `node server.js` (uses `server.js` as entry)
- Check `diagnose.js` to validate env vars before starting
- Verbose logging in `server.js` for route mounting

### Frontend
- `npm run dev` → Next.js dev server (port 3000)
- `npm run build` → Production build
- Service worker registered in `components/register-service-worker.tsx`

### Database
- Mongoose auto-creates collections; verify `MONGO_URI` in `.env`
- Models use `mongoose.model('ResourceName', schema)` export

---

**Key Principle**: This is a **monolithic full-stack app with separated frontend/backend**. Treat them as independent deployments; communication is HTTP-based only.
