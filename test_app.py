import reflex as rx

class State(rx.State):
    count: int = 0

    def increment(self):
        self.count += 1

    def decrement(self):
        self.count -= 1

def index():
    return rx.center(
        rx.vstack(
            rx.heading("Counter App"),
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
            padding="1em",
            border_radius="0.5em",
            box_shadow="lg",
        )
    )

app = rx.App()
app.add_page(index)