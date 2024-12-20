### Enhanced Roadmap for Frontend Development with Next.js and Tailwind CSS

**Introduction**
This roadmap ensures that all backend features from the provided `api-docs.json` file are implemented in the frontend, leveraging the tech stack: Next.js, Tailwind CSS, and ShadCN/UI. Each feature aligns with corresponding API endpoints for seamless integration.

---

### **1. Environment Setup**
- Configure the `.env.local` file with the backend URL:
  ```env
  NEXT_PUBLIC_API_BASE_URL=http://localhost:3009
  ```

---

### **2. Landing Page**
**Goal**: Create a visually appealing introduction to the platform.
- **Features**:
  - Tagline: "A place to share your ideas."
  - CTA buttons: *Sign Up* and *Log In*.
- **APIs**: None required.
- **Implementation**:
  - Design with Tailwind CSS and responsive layout.
  - Include a brief platform description.

---

### **3. Authentication (Registration/Login Popup)**
**Goal**: Allow users to register and log in.
- **Features**:
  - Popup modal for login/registration.
  - Form validation and API error display.
  - Token storage (e.g., `localStorage`) and role-based navigation.
- **APIs**:
  - Registration: `POST /auth/register`
  - Login: `POST /auth/login`
  - Get Current User: `GET /users/me`
- **Implementation**:
  - Use `jwt` tokens for authentication.
  - Protect routes using middleware to ensure only authenticated users access certain features.

---

### **4. Onboarding Page**
**Goal**: Gather user preferences and allow survey creation.
- **Features**:
  - Collect user information and interests via categories (`GET /categories`).
  - Enable first survey creation (`POST /posts/surveys`) with an option to share its link.
  - Propose thread creation and linking the survey (`POST /threads` and `POST /threads/{threadId}/posts/{postId}`).
- **APIs**:
  - Fetch categories: `GET /categories`.
  - Create survey: `POST /posts/surveys`.
  - Create thread: `POST /threads`.
  - Link survey to thread: `POST /threads/{threadId}/posts/{postId}`.

---

### **5. Community Page**
**Goal**: Display categorized community posts.
- **Features**:
  - List featured posts.
  - Filters by category, type, and other metadata.
- **APIs**:
  - Fetch threads: `GET /threads`.
  - Fetch posts by filters: `GET /posts` (with query parameters).
- **Implementation**:
  - Infinite scroll or pagination using query parameters like `page`, `size`, and `sortBy`.

---

### **6. User Social Profile Page**
**Goal**: Showcase user profile details and posts.
- **Features**:
  - Display user info (`GET /social-profiles/{userId}`) like bio, avatar, and social links (`GET /social-profiles/me`).
  - Allow updates to profile (`PUT /social-profiles/me`).
  - List user-created posts, grouped by type.
  - Post creation via popup (survey, project, inquiry, fundraiser).
- **APIs**:
  - Get user details: `GET /users/{userId}`.
  - Update profile: `PUT /social-profiles/me`.
  - Create posts: `POST /posts/surveys`, `POST /posts/projects`, `POST /posts/inquiries`.

---

### **7. Admin Panel**
**Goal**: Empower admins to moderate and manage the platform.
- **Features**:
  - Manage categories: `GET`, `POST`, `PUT`, `DELETE /categories`.
  - Moderate posts: Deactivate violating posts (`PATCH /posts/{postId}`).
  - Manage users: View, update, and delete (`GET`, `PUT`, `DELETE /users/{userId}`).
  - Role management: Assign roles (`PUT /roles/{id}`).
- **APIs**:
  - All under "Moderation," "Users," and "Roles."

---

### **8. Content Moderation**
**Goal**: Allow admins to review flagged posts.
- **Features**:
  - Display flagged content.
  - Approve/reject with comments.
- **APIs**:
  - Moderation actions: `PATCH /posts/{postId}`.

---

### **9. Threads and Posts**
**Goal**: Enable users to manage threads and associated posts.
- **Features**:
  - Thread creation (`POST /threads`).
  - Add or remove posts from threads (`POST`, `DELETE /threads/{threadId}/posts/{postId}`).
  - Pin/unpin posts in threads (`POST`, `DELETE /threads/{threadId}/posts/{postId}/pin`).
- **APIs**:
  - All under "Threads."

---

### **10. Survey Responses**
**Goal**: Submit and analyze survey responses.
- **Features**:
  - Open-ended response submission (`POST /responses/open-ended/{surveyId}`).
  - Multiple-choice response submission (`POST /responses/multiple-choice/{surveyId}`).
  - Analyze responses (`GET /responses/{surveyId}/results`).
- **APIs**:
  - All under "Survey Responses."

---

### **11. Projects**
**Goal**: Support collaborative project management.
- **Features**:
  - Create projects (`POST /posts/projects`).
  - Manage participants (`POST`, `DELETE /posts/projects/{projectId}/participants/{profileId}`).
  - Upload and view attachments (`POST`, `GET /posts/projects/{projectId}/attachments`).
- **APIs**:
  - All under "Projects."

---

### **12. Professional Inquiries**
**Goal**: Enable professional collaboration.
- **Features**:
  - Post inquiries (`POST /posts/inquiries`).
  - Apply to inquiries (`POST /posts/inquiries/{id}/applications`).
  - View inquiry applications (`GET /posts/inquiries/{id}/applications`).
- **APIs**:
  - All under "Inquiries."

---

### **13. Advanced Styling and UX**
**Goal**: Ensure responsive design and interactive elements.
- **Tools**:
  - ShadCN/UI for prebuilt components.
  - Lucide icons for intuitive design.

---

### **14. Testing and Deployment**
**Steps**:
- Implement unit and integration tests for all API interactions.
- Deploy to Vercel with environment variables.

This roadmap will ensure a feature-complete, user-friendly frontend aligned with the provided backend API. Let me know if you’d like detailed code snippets or specific implementation guidance!