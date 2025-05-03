"""
EZ Narratives - Reflex Web Application
======================================

This is the main entry point for the Reflex web application.
"""

import reflex as rx

from rxconfig import config


class State(rx.State):
    """The app state."""
    count: int = 0

    def increment(self):
        self.count += 1

    def decrement(self):
        self.count -= 1


def index() -> rx.Component:
    """The main index page."""
    return rx.center(
        rx.vstack(
            rx.heading("EZ Narratives", size="1", mb=6),
            rx.text("EMS and Fire Narrative Generation", mb=4),
            rx.hstack(
                rx.button(
                    "Decrement",
                    on_click=State.decrement,
                ),
                rx.heading(State.count, font_size="2em"),
                rx.button(
                    "Increment",
                    on_click=State.increment,
                ),
            ),
            rx.button(
                "Get Started",
                size="3",
                color="indigo",
                on_click=rx.redirect("/dashboard"),
            ),
            spacing="4",
            padding="8",
            border_radius="lg",
            border="1px solid #eaeaea",
            box_shadow="lg",
            width="100%",
            max_width="400px",
        ),
        height="100vh",
    )


def dashboard() -> rx.Component:
    """A simple dashboard page."""
    return rx.center(
        rx.vstack(
            rx.heading("Dashboard", size="1", mb=6),
            rx.text("This is a simple dashboard page.", mb=4),
            rx.button(
                "Go Home",
                size="3",
                color="indigo",
                on_click=rx.redirect("/"),
            ),
            spacing="4",
            padding="8",
            border_radius="lg",
            border="1px solid #eaeaea",
            box_shadow="lg",
            width="100%",
            max_width="400px",
        ),
        height="100vh",
    )


# Define the app
app = rx.App(
    stylesheets=[
        "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
    ],
)

# Add pages to the app
app.add_page(index, route="/")
app.add_page(dashboard, route="/dashboard")