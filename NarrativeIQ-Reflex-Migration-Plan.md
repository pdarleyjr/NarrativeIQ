# EZ Narratives to Reflex Migration Plan

This document outlines a comprehensive plan for migrating the React-based EZ Narratives frontend to a Reflex-based implementation. The migration will preserve existing functionality while leveraging Reflex's Python-based approach for better integration with backend services.

## Table of Contents

1. [Stack Comparison](#stack-comparison)
2. [Component Mapping](#component-mapping)
3. [State Management Migration](#state-management-migration)
4. [API & Data Flow Migration](#api--data-flow-migration)
5. [Authentication Flow Migration](#authentication-flow-migration)
6. [UI/UX Migration](#uiux-migration)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Testing & Validation Strategy](#testing--validation-strategy)
9. [Appendix: Code Snippets](#appendix-code-snippets)

## Stack Comparison

### Current EZ Narratives Stack (React/TypeScript)

```
Frontend Framework: React 18 with TypeScript
Build Tool: Vite
UI Components: Shadcn/UI (Radix UI + Tailwind)
State Management: React Context + useState/useEffect
Styling: Tailwind CSS
Authentication: Supabase Auth
Database: Supabase
AI Integration: OpenAI API (direct JS client)
Routing: React Router
Form Handling: React Hook Form
```

### Target Reflex Stack (Python)

```
Frontend Framework: Reflex (Python-based)
Build Tool: Reflex CLI
UI Components: Reflex components with Tailwind
State Management: Reflex State classes
Styling: Tailwind CSS
Authentication: Supabase Auth (Python client)
Database: Supabase (Python client)
AI Integration: OpenAI API (Python client)
Routing: Reflex routing
Form Handling: Reflex state and events
```

## Component Mapping

### Core UI Components

| React Component | Reflex Equivalent | Notes |
|-----------------|-------------------|-------|
| `<Button>` | `rx.button()` | Map variants using Tailwind classes |
| `<Input>` | `rx.input()` | Add event handlers for onChange |
| `<Textarea>` | `rx.textarea()` | Map rows and other props |
| `<Select>` | `rx.select()` | Create custom select with options |
| `<Switch>` | Custom component | Create using rx.checkbox with styling |
| `<Card>` | `rx.box()` with styling | Apply card styling with Tailwind |
| `<Dialog>` | Custom modal component | Create using rx.modal |
| `<Tabs>` | Custom tabs component | Create using rx.tabs |
| `<Collapsible>` | Custom component | Create using rx.cond and state |

### Page Components

| React Page | Reflex Page | Key Components |
|------------|------------|----------------|
| `Dashboard.tsx` | `dashboard.py` | Sidebar, AppTabs |
| `IntegratedDashboard.tsx` | `integrated_dashboard.py` | EMSPanel, NFIRSPanel, ChatPanel |
| `Login.tsx` | `auth/login.py` | Auth forms |
| `CreateNarrative.tsx` | `narratives/create.py` | NarrativeForm |
| `ViewNarrative.tsx` | `narratives/view.py` | NarrativeDisplay |
| `Settings.tsx` | `settings.py` | SettingsForm |

### Feature Components

| React Component | Reflex Component | State Requirements |
|-----------------|------------------|-------------------|
| `EMSPanel.tsx` | `ems_panel.py` | EMS form state, narrative generation |
| `NFIRSPanel.tsx` | `nfirs_panel.py` | NFIRS form state |
| `ChatPanel.tsx` | `chat_panel.py` | Chat state, message history |
| `DashboardSidebar.tsx` | `dashboard_sidebar.py` | Navigation state, session state |
| `NarrativeForm.tsx` | `narrative_form.py` | Form state, validation |
| `NarrativeKnowledgeBaseSelector.tsx` | `knowledge_base_selector.py` | KB selection state |

## State Management Migration

### React Context to Reflex State

The current EZ Narratives application uses React Context for global state management. In Reflex, we'll use State classes:

```python
# Example: AuthState migration
class AuthState(rx.State):
    """Authentication state management."""
    
    user: dict = None
    is_loading: bool = True
    is_admin: bool = False
    
    @rx.var
    def is_authenticated(self) -> bool:
        """Check if user is authenticated."""
        return self.user is not None
    
    @rx.event
    async def login(self, email: str, password: str):
        """Log in a user with email and password."""
        self.is_loading = True
        try:
            # Use supabase-py client
            result = await supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if result.user:
                self.user = result.user
                await self.check_admin_status(result.user.id)
                return {"success": True}
            else:
                return {"success": False, "error": result.error}
        finally:
            self.is_loading = False
    
    @rx.event
    async def check_admin_status(self, user_id: str):
        """Check if the user has admin role."""
        try:
            result = await supabase.from_("user_roles").select("role").eq("user_id", user_id).maybe_single()
            
            if result.data:
                self.is_admin = result.data.get("role") == "admin"
            else:
                self.is_admin = False
        except Exception as e:
            print(f"Error checking admin status: {e}")
            self.is_admin = False
```

### Form State Migration

React Hook Form will be replaced with Reflex state variables and event handlers:

```python
# Example: EMSState for form management
class EMSState(rx.State):
    """State for EMS narrative form."""
    
    # Form fields
    unit: str = ""
    dispatch_reason: str = ""
    response_delay: str = "No response delays"
    patient_sex: str = ""
    patient_age: str = ""
    chief_complaint: str = ""
    # ... other form fields
    
    # Generated narrative
    narrative_text: str = ""
    
    @rx.event
    def set_unit(self, value: str):
        """Set the unit value."""
        self.unit = value
    
    # ... other setters
    
    @rx.event
    async def generate_narrative(self):
        """Generate narrative from form data."""
        # Prepare data for OpenAI
        form_data = {
            "unit": self.unit,
            "dispatch_reason": self.dispatch_reason,
            # ... other fields
        }
        
        # Call OpenAI
        try:
            result = await generate_ems_narrative(form_data)
            self.narrative_text = result
            return {"success": True}
        except Exception as e:
            print(f"Error generating narrative: {e}")
            return {"success": False, "error": str(e)}
```

## API & Data Flow Migration

### Supabase Integration

Migrate from JavaScript Supabase client to Python:

```python
# Current JS implementation
const { data, error } = await supabase
  .from('narratives')
  .select('*')
  .eq('user_id', user.id);

# Reflex Python implementation
from supabase import create_client

supabase = create_client(
    supabase_url=os.environ.get("SUPABASE_URL"),
    supabase_key=os.environ.get("SUPABASE_ANON_KEY")
)

class NarrativeState(rx.State):
    narratives: list = []
    
    @rx.event
    async def fetch_narratives(self):
        user_id = self.get_user_id()
        result = await supabase.table("narratives").select("*").eq("user_id", user_id).execute()
        
        if result.data:
            self.narratives = result.data
```

### OpenAI Integration

Migrate from JavaScript OpenAI client to Python:

```python
# Current JS implementation
const response = await openai.chat.completions.create({
  model: MODELS.CHAT,
  messages: [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage }
  ],
  temperature: 0.7,
  max_tokens: 1500,
});

# Reflex Python implementation
import openai
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

async def generate_ems_narrative(form_data: dict) -> str:
    """Generate an EMS narrative using OpenAI."""
    system_message = """
    You are an EMS narrative assistant. Generate a comprehensive NFIRS-compliant narrative 
    based on the provided run data.
    """
    
    user_message = f"Run Data:\n{json.dumps(form_data, indent=2)}"
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating narrative: {e}")
        raise e
```

## Authentication Flow Migration

### Authentication Process

1. **Login Flow**:

```python
# Login component in Reflex
def login_form():
    return rx.vstack(
        rx.heading("Log In", size="lg"),
        rx.input(
            placeholder="Email",
            id="email",
            type="email",
            on_change=AuthState.set_email,
        ),
        rx.input(
            placeholder="Password",
            id="password",
            type="password",
            on_change=AuthState.set_password,
        ),
        rx.button(
            "Log In",
            on_click=AuthState.login,
            is_loading=AuthState.is_loading,
            width="100%",
        ),
        rx.text(
            "Don't have an account?",
            rx.link("Sign up", href="/signup", color="blue.500"),
            color="gray.500",
        ),
        spacing="4",
        width="100%",
        max_width="400px",
        padding="6",
    )
```

2. **Session Management**:

```python
# Session management in Reflex
class SessionState(rx.State):
    """Manage user sessions."""
    
    # Store active session
    active_session: str | None = None
    sessions: list[dict] = []
    
    @rx.var
    def is_authenticated(self) -> bool:
        """Check if user is authenticated by accessing AuthState."""
        auth_state = self.get_state(AuthState)
        return auth_state.is_authenticated
    
    @rx.event
    async def load_sessions(self):
        """Load user sessions from database."""
        if not self.is_authenticated:
            return
            
        auth_state = self.get_state(AuthState)
        user_id = auth_state.user.get("id")
        
        result = await supabase.table("sessions").select("*").eq("user_id", user_id).execute()
        
        if result.data:
            self.sessions = result.data
```

## UI/UX Migration

### Tailwind Integration

Reflex supports Tailwind CSS. We'll configure it to match the current EZ Narratives theme:

```python
# rxconfig.py
import reflex as rx

config = rx.Config(
    app_name="narrative_iq",
    tailwind={
        "theme": {
            "extend": {
                "colors": {
                    "primary": {
                        "50": "#f0f9ff",
                        "100": "#e0f2fe",
                        # ... other shades
                        "600": "#0284c7",
                        "700": "#0369a1",
                    },
                    "ems": {
                        "100": "#e6e7ff",
                        "200": "#c5c7fa",
                        "300": "#a3a5f7",
                        "400": "#8183f4",
                        "500": "#6366f1",  # Primary indigo
                        "600": "#4f46e5",  # Darker indigo
                        "700": "#4338ca",
                        "800": "#3730a3",
                        "900": "#312e81",
                    },
                }
            }
        },
        "plugins": ["@tailwindcss/typography"]
    }
)
```

### Responsive Design

Implement responsive design using Reflex's conditional rendering:

```python
def sidebar():
    """Responsive sidebar component."""
    is_mobile = rx.State.is_mobile
    
    return rx.box(
        rx.cond(
            is_mobile,
            # Mobile sidebar (collapsed by default)
            rx.box(
                # Mobile sidebar content
                width="0",
                class_name="sm:w-14 transition-all duration-300",
            ),
            # Desktop sidebar
            rx.box(
                # Desktop sidebar content
                width="64",
                class_name="transition-all duration-300",
            ),
        ),
        # Common sidebar styles
        class_name="h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
    )
```

## Implementation Roadmap

### Phase 1: Project Setup and Core Infrastructure (Week 1)

1. Initialize new Reflex project:
   ```bash
   reflex init eznarratives_reflex_v3
   ```

2. Configure Tailwind CSS to match EZ Narratives theme:
   ```python
   # rxconfig.py
   import reflex as rx
   
   config = rx.Config(
       app_name="eznarratives_reflex_v3",
       tailwind={
           "theme": {
               "extend": {
                   "colors": {
                       # Copy colors from EZ Narratives tailwind.config.ts
                   }
               }
           },
           "plugins": ["@tailwindcss/typography"]
       }
   )
   ```

3. Set up project structure:
   ```
   app/
     __init__.py
     app.py
     components/
       __init__.py
       ui/  # Base UI components
       dashboard/  # Dashboard components
       forms/  # Form components
     states/
       __init__.py
       auth_state.py
       ems_state.py
       nfirs_state.py
       chat_state.py
     pages/
       __init__.py
       index.py
       dashboard.py
       auth/
         login.py
         signup.py
       narratives/
         create.py
         view.py
     lib/
       __init__.py
       supabase.py
       openai_client.py
   assets/
     styles.css
   ```

4. Implement authentication state and Supabase integration

### Phase 2: Core UI Components (Week 2)

1. Implement base UI components:
   - Button
   - Input
   - Textarea
   - Select
   - Switch
   - Card
   - Dialog
   - Tabs

2. Create layout components:
   - Sidebar
   - Header
   - Main content area
   - Tab container

3. Implement responsive design utilities

### Phase 3: Feature Components (Weeks 3-4)

1. Implement EMS form components:
   - Dispatch section
   - Patient information section
   - Assessment section
   - Treatment section
   - Transport section

2. Implement NFIRS form components

3. Implement Chat interface

4. Create narrative generation workflow

### Phase 4: Integration and Testing (Week 5)

1. Connect to OpenAI API for narrative generation

2. Implement database operations for saving/loading narratives

3. Set up authentication flows

4. Comprehensive testing of all features

### Phase 5: Optimization and Deployment (Week 6)

1. Performance optimization

2. Final UI/UX refinements

3. Deployment setup

4. Documentation

## Testing & Validation Strategy

### Unit Testing

1. **State Testing**:
   - Test state transitions
   - Validate event handlers
   - Verify computed properties

```python
# Example test for AuthState
def test_auth_state_login():
    # Setup
    auth_state = AuthState()
    
    # Mock Supabase response
    with patch("supabase.auth.sign_in_with_password") as mock_sign_in:
        mock_sign_in.return_value = {"user": {"id": "123", "email": "test@example.com"}, "error": None}
        
        # Execute
        result = auth_state.login("test@example.com", "password")
        
        # Assert
        assert result["success"] is True
        assert auth_state.user == {"id": "123", "email": "test@example.com"}
        assert auth_state.is_authenticated is True
```

### Integration Testing

1. **Form Submission Testing**:
   - Test form validation
   - Verify data flow from form to API
   - Test narrative generation

2. **Authentication Flow Testing**:
   - Test login/logout process
   - Verify protected routes
   - Test session persistence

### End-to-End Testing

1. **User Journey Testing**:
   - Complete narrative creation flow
   - Dashboard navigation
   - Settings management

2. **Cross-browser Testing**:
   - Test on Chrome, Firefox, Safari
   - Test responsive design on mobile devices

## Appendix: Code Snippets

### EMS Form Implementation

```python
def ems_form() -> rx.Component:
    """EMS report form component."""
    return rx.box(
        rx.box(
            rx.cond(
                EMSState.narrative_text,
                rx.text(
                    EMSState.narrative_text,
                    class_name="text-sm text-gray-700 dark:text-gray-300 p-4 whitespace-pre-wrap",
                ),
                rx.text(
                    "Generated narrative will appear here...",
                    class_name="text-sm text-gray-500 dark:text-gray-400 italic p-4 text-center",
                ),
            ),
            class_name="h-[max(200px,30vh)] bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-y-auto",
        ),
        rx.box(
            rx.box(
                form_section_button("siren", "Dispatch", "Dispatch"),
                form_section_button("map-pin", "Arrival", "Arrival"),
                form_section_button("clipboard-list", "Assessment", "Assessment"),
                form_section_button("syringe", "Treatment", "Treatment"),
                form_section_button("truck", "Transport", "Transport"),
                class_name="grid grid-cols-5 gap-1 p-1 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10",
            ),
            rx.box(
                rx.box(
                    rx.match(
                        EMSState.active_ems_section,
                        ("Dispatch", dispatch_section()),
                        ("Arrival", arrival_section()),
                        ("Assessment", assessment_section()),
                        ("Treatment", treatment_section()),
                        ("Transport", transport_section()),
                        rx.text("Select a section"),
                    ),
                    class_name="p-4 md:p-6 pb-20",
                    key=EMSState.active_ems_section,
                ),
                class_name="flex-1 overflow-y-auto",
            ),
            rx.box(
                rx.button(
                    rx.icon(
                        tag="arrow-up",
                        class_name="stroke-current",
                        size=24,
                    ),
                    on_click=EMSState.generate_narrative,
                    class_name="w-11 h-11 p-2 rounded-lg text-white bg-accent hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-lg transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center",
                    type="button",
                    aria_label="Generate EMS Narrative",
                ),
                class_name="absolute bottom-4 right-4 z-20",
            ),
            class_name="flex-1 flex flex-col overflow-hidden relative",
        ),
        class_name="flex flex-col h-full",
    )
```

### Narrative Generation Service

```python
# lib/narrative_service.py
import os
import json
from typing import Dict, List, Any
import openai
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

async def generate_ems_narrative(form_data: Dict[str, Any], context_snippets: List[str] = None) -> str:
    """Generate an EMS narrative using OpenAI."""
    system_message = """
    You are an EMS narrative assistant. Generate a comprehensive NFIRS-compliant narrative 
    based on the provided run data.
    Use only the reference materials provided to inform your narrative. 
    Do not invent facts or procedures not mentioned in the reference materials.
    Format the narrative professionally and include all relevant details from the run data.
    """
    
    user_message = f"Run Data:\n{json.dumps(form_data, indent=2)}"
    
    if context_snippets and len(context_snippets) > 0:
        user_message += "\n\nReference Materials:\n" + "\n\n".join(context_snippets)
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating narrative: {e}")
        raise e
```

### Supabase Integration

```python
# lib/supabase.py
import os
from supabase import create_client, Client

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    raise ValueError(
        "Supabase configuration is missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in environment variables."
    )

supabase: Client = create_client(supabase_url, supabase_key)

def is_supabase_configured() -> bool:
    """Check if Supabase is properly configured."""
    return bool(supabase_url) and bool(supabase_key)
```

This migration plan provides a comprehensive roadmap for transitioning from the React-based EZ Narratives frontend to a Reflex-based implementation. By following this structured approach, the migration can be completed efficiently while ensuring feature parity and maintaining the existing user experience.