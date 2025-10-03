// File: src/lib/data.js
// This is your new central, shared "database"

export const users = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    role: "Teacher",
    status: "Active",
    lastLogin: "2024-01-15",
  },
  // ... other original users
];

let nextId = 5; // Start after your last original user

export function getNextId() {
  return nextId++;
}