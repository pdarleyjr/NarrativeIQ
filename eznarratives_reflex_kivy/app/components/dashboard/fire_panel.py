"""
FirePanel Component for EZ Narratives
===================================

This component provides a form interface for generating Fire/NFIRS narratives.
"""

import reflex as rx
from typing import Dict, Any, List, Callable, Optional


class FirePanel(rx.Component):
    """A component for the Fire narrative form."""
    
    # Define the library to use
    library = "app.components.dashboard"
    
    # Define the tag
    tag = "FirePanel"
    
    # Define the properties
    report_text: str
    on_generate_report: Callable[[Dict[str, Any]], None]


def fire_panel(
    report_text: str = "No NFIRS report generated yet. Fill out the form below and click 'Generate Report'.",
    on_generate_report: Optional[Callable[[Dict[str, Any]], None]] = None,
) -> rx.Component:
    """Create a Fire panel component.
    
    Args:
        report_text: The generated report text.
        on_generate_report: Function to handle report generation.
        
    Returns:
        A Fire panel component.
    """
    is_mobile = rx.use_media_query("(max-width: 768px)")
    is_advanced_open = rx.State(True)
    
    # Form states
    form_data = rx.State({
        "unit": "",
        "emergency_type": "",
        "custom_emergency_type": "",
        "additional_info": "",
    })
    
    # Emergency types list
    emergency_types = [
        "Structure Fire", "Vehicle Fire", "Cooking Fire (Confined)", "Chimney/Flue Fire",
        "Fire in Mobile Home", "Smoke Scare", "Wildland Fire", "Brush Fire", "Grass Fire",
        "Unauthorized Burning", "Smoke Report", "Medical Call", "MVA w/ Injuries",
        "MVA No Injuries", "Extrication", "Search for Person on Land", "Search for Person in Water",
        "Gas Leak", "CO Incident", "Power Line Down", "Hazardous Materials Spill",
        "Smoke Alarm Activation", "False Alarm", "Public Assist", "Ice Rescue",
        "Water Rescue", "Animal Rescue", "Technical Rescue", "High-Angle Rescue",
        "Confined Space Rescue", "Elevator Rescue (Stuck Elevator)", "Natural Gas Leak",
        "Electrical Fire", "Outdoor Fire", "Other"
    ]
    
    def handle_submit(form_data):
        """Handle form submission."""
        if on_generate_report:
            # Format fire data for narrative generation
            emergency_type_text = form_data["custom_emergency_type"] if form_data["emergency_type"] == "Other" else form_data["emergency_type"]
            
            # Create narrative data with fire incident information
            narrative_data = {
                "unit": form_data["unit"],
                "dispatch_reason": f"Fire: {emergency_type_text}",
                "additional_info": form_data["additional_info"],
            }
            
            on_generate_report(narrative_data)
    
    return rx.motion.div(
        rx.flex(
            # Generated Report Card
            rx.card(
                rx.card_content(
                    rx.heading("Generated NFIRS Report", size="lg", mb="2"),
                    rx.text(report_text, whitespace="pre-wrap", size="sm"),
                    p="4",
                ),
                class_name="h-2/5 overflow-auto mb-2",
            ),
            
            # Form Area
            rx.box(
                rx.collapsible(
                    rx.flex(
                        rx.heading("NFIRS Form", size="lg"),
                        rx.collapsible_trigger(
                            rx.button(
                                rx.cond(
                                    is_advanced_open,
                                    rx.hstack(
                                        rx.icon("chevron-up", size=4, mr=1),
                                        rx.text("Hide Form", size="sm"),
                                    ),
                                    rx.hstack(
                                        rx.icon("chevron-down", size=4, mr=1),
                                        rx.text("Show Form", size="sm"),
                                    ),
                                ),
                                variant="ghost",
                                size="sm",
                            ),
                        ),
                        justify_content="space-between",
                        align_items="center",
                        px="4",
                        py="2",
                        border_bottom="1px solid",
                        border_color="gray.200",
                        dark_border_color="gray.700",
                    ),
                    
                    rx.collapsible_content(
                        rx.scroll_area(
                            rx.form(
                                # Basic Fire Information
                                rx.fieldset(
                                    rx.legend("Basic Information", font_weight="semibold", size="sm", px="2"),
                                    rx.grid(
                                        rx.vstack(
                                            rx.label(
                                                "Unit ",
                                                rx.span("*", color="red.500"),
                                                html_for="unit",
                                            ),
                                            rx.input(
                                                id="unit",
                                                value=form_data["unit"],
                                                on_change=lambda value: form_data.update({"unit": value}),
                                                placeholder="Enter responding unit",
                                                required=True,
                                            ),
                                            spacing="1",
                                        ),
                                        rx.vstack(
                                            rx.label(
                                                "Emergency Type ",
                                                rx.span("*", color="red.500"),
                                                html_for="emergency_type",
                                            ),
                                            rx.select(
                                                emergency_types,
                                                id="emergency_type",
                                                value=form_data["emergency_type"],
                                                on_change=lambda value: form_data.update({"emergency_type": value}),
                                                placeholder="Select Emergency Type",
                                                required=True,
                                            ),
                                            spacing="1",
                                        ),
                                        rx.cond(
                                            form_data["emergency_type"] == "Other",
                                            rx.vstack(
                                                rx.label(
                                                    "Specify Emergency Type ",
                                                    rx.span("*", color="red.500"),
                                                    html_for="custom_emergency_type",
                                                ),
                                                rx.input(
                                                    id="custom_emergency_type",
                                                    value=form_data["custom_emergency_type"],
                                                    on_change=lambda value: form_data.update({"custom_emergency_type": value}),
                                                    placeholder="Specify emergency type",
                                                    required=True,
                                                ),
                                                spacing="1",
                                                col_span=2,
                                            ),
                                        ),
                                        rx.vstack(
                                            rx.label("Additional Information", html_for="additional_info"),
                                            rx.textarea(
                                                id="additional_info",
                                                value=form_data["additional_info"],
                                                on_change=lambda value: form_data.update({"additional_info": value}),
                                                placeholder="Enter any additional remarks or information",
                                                rows=6,
                                            ),
                                            spacing="1",
                                            col_span=2,
                                        ),
                                        template_columns="repeat(2, 1fr)",
                                        gap="4",
                                    ),
                                    border="1px solid",
                                    border_color="gray.200",
                                    dark_border_color="gray.700",
                                    rounded="md",
                                    p="4",
                                ),
                                
                                # Submit Button
                                rx.button(
                                    "Generate NFIRS Report",
                                    type="submit",
                                    width="100%",
                                    color_scheme="red",
                                    on_click=lambda: handle_submit(form_data),
                                    mt="6",
                                ),
                                
                                on_submit=lambda: handle_submit(form_data),
                                class_name="p-4 space-y-6",
                            ),
                            class_name="h-full",
                        ),
                        class_name="flex-1 overflow-hidden",
                    ),
                    
                    open=is_advanced_open,
                    on_open_change=lambda: is_advanced_open.set(not is_advanced_open.get()),
                    class_name="flex-1 overflow-hidden flex flex-col",
                ),
                
                # Collapsed View
                rx.cond(
                    not is_advanced_open,
                    rx.box(
                        rx.textarea(
                            value=report_text,
                            placeholder="Enter your NFIRS report text here...",
                            class_name="min-h-[150px]",
                            is_read_only=True,
                        ),
                        rx.button(
                            "Show Advanced Options",
                            variant="outline",
                            class_name="mt-2 w-full",
                            on_click=lambda: is_advanced_open.set(True),
                        ),
                        p="4",
                    ),
                ),
                
                class_name="h-3/5 overflow-hidden flex flex-col",
            ),
            
            direction="column",
            height="100%",
        ),
        initial={"opacity": 0},
        animate={"opacity": 1},
        exit={"opacity": 0},
        transition={"type": "spring", "stiffness": 120, "damping": 15},
        class_name="flex flex-col h-full",
    )