# Copilot Instructions for Backend-Clinica-Veterinaria-v2

## Project Overview
This project is a backend for a veterinary clinic management system. It is structured as a Node.js application with the following key components:

- **API Endpoints**: Defined in `routes/` directory, each file corresponds to a specific resource (e.g., `animals.js`, `appointments.js`).
- **Controllers**: Located in `controllers/`, these files handle the business logic for each resource.
- **Models**: Found in `models/`, these files define the data structure and database interactions.
- **Middleware**: Custom middleware for authentication and admin checks are in `middleware/`.
- **Services**: External integrations, such as `googleCalendarService.js`, are in `services/`.

## Key Patterns and Conventions

### Routing
- Routes are modularized by resource and located in `routes/`.
- Example: `routes/animals.js` defines endpoints for animal-related operations.

### Controllers
- Controllers handle the core logic and are named after the resource they manage.
- Example: `controllers/animalController.js` manages animal-related logic.

### Models
- Models define the schema and database interactions.
- Example: `models/animalModel.js` defines the schema for animals.

### Middleware
- Authentication middleware is in `middleware/auth.js`.
- Admin-specific checks are in `middleware/adminMiddleware.js`.

### Services
- External integrations are abstracted into services.
- Example: `services/googleCalendarService.js` integrates with Google Calendar.

## Developer Workflows

### Running the Server
- Use `npm start` to start the server.
- Use `npm run dev` for development mode with hot-reloading.

### Testing
- Tests are located in the root directory (e.g., `testCorsMount.js`).
- Run tests with `npm test`.

### Debugging
- Use `console.log` for quick debugging.
- For advanced debugging, use Node.js Inspector (`node --inspect`).

## External Dependencies
- **Database**: Ensure the database connection is configured in `config/db.js`.
- **Google Calendar**: Requires API keys configured in `services/googleCalendarService.js`.

## Tips for AI Agents
- Follow the modular structure: routes -> controllers -> models.
- Look for reusable patterns in `services/` and `middleware/`.
- When adding new features, ensure they align with the existing folder structure and naming conventions.
- Always validate inputs in controllers to maintain data integrity.

## Example: Adding a New Resource
1. Create a new route file in `routes/` (e.g., `routes/newResource.js`).
2. Implement the logic in a corresponding controller (e.g., `controllers/newResourceController.js`).
3. Define the schema in a model file (e.g., `models/newResourceModel.js`).
4. Add any necessary middleware or services.
5. Update `server.js` to include the new route.

---

This document is a living guide. Update it as the project evolves.