"""
EMSPanel Component for EZ Narratives
==================================

This component provides a form interface for generating EMS narratives.
"""

import reflex as rx
from typing import Dict, Any, List, Callable, Optional


class EMSPanel(rx.Component):
    """A component for the EMS narrative form."""
    
    # Define the library to use
    library = "app.components.dashboard"
    
    # Define the tag
    tag = "EMSPanel"
    
    # Define the properties
    narrative_text: str
    on_generate_narrative: Callable[[Dict[str, Any]], None]
    default_form_data: Dict[str, Any]


def ems_panel(
    narrative_text: str = "No narrative generated yet. Fill out the form below and click 'Generate Narrative'.",
    on_generate_narrative: Optional[Callable[[Dict[str, Any]], None]] = None,
    default_form_data: Optional[Dict[str, Any]] = None,
) -> rx.Component:
    """Create an EMS panel component.
    
    Args:
        narrative_text: The generated narrative text.
        on_generate_narrative: Function to handle narrative generation.
        default_form_data: Default values for the form.
        
    Returns:
        An EMS panel component.
    """
    is_mobile = rx.use_media_query("(max-width: 768px)")
    is_advanced_open = rx.State(True)
    
    # Form states
    form_data = rx.State({
        "unit": default_form_data.get("unit", "") if default_form_data else "",
        "dispatch_reason": default_form_data.get("dispatch_reason", "") if default_form_data else "",
        "response_delay": default_form_data.get("response_delay", "No response delays") if default_form_data else "No response delays",
        "response_delay_custom": default_form_data.get("response_delay_custom", "") if default_form_data else "",
        "patient_sex": default_form_data.get("patient_sex", "") if default_form_data else "",
        "patient_age": default_form_data.get("patient_age", "") if default_form_data else "",
        "chief_complaint": default_form_data.get("chief_complaint", "") if default_form_data else "",
        "duration": default_form_data.get("duration", "") if default_form_data else "",
        "patient_presentation": default_form_data.get("patient_presentation", "") if default_form_data else "",
        "aao_person": default_form_data.get("aao_person", True) if default_form_data else True,
        "aao_place": default_form_data.get("aao_place", True) if default_form_data else True,
        "aao_time": default_form_data.get("aao_time", True) if default_form_data else True,
        "aao_event": default_form_data.get("aao_event", True) if default_form_data else True,
        "is_unresponsive": default_form_data.get("is_unresponsive", False) if default_form_data else False,
        "gcs_score": default_form_data.get("gcs_score", "15") if default_form_data else "15",
        "pupils": default_form_data.get("pupils", "PERRL") if default_form_data else "PERRL",
        "selected_pertinent_negatives": default_form_data.get("selected_pertinent_negatives", []) if default_form_data else [],
        "unable_to_obtain_negatives": default_form_data.get("unable_to_obtain_negatives", False) if default_form_data else False,
        "vital_signs_normal": default_form_data.get("vital_signs_normal", True) if default_form_data else True,
        "selected_abnormal_vitals": default_form_data.get("selected_abnormal_vitals", []) if default_form_data else [],
        "all_other_vitals_normal": default_form_data.get("all_other_vitals_normal", True) if default_form_data else True,
        "dcap_btls": default_form_data.get("dcap_btls", True) if default_form_data else True,
        "additional_assessment": default_form_data.get("additional_assessment", "") if default_form_data else "",
        "treatment_provided": default_form_data.get("treatment_provided", "") if default_form_data else "",
        "add_protocol_treatments": default_form_data.get("add_protocol_treatments", False) if default_form_data else False,
        "protocol_exclusions": default_form_data.get("protocol_exclusions", "") if default_form_data else "",
        "refused_transport": default_form_data.get("refused_transport", False) if default_form_data else False,
        "refusal_details": default_form_data.get("refusal_details", "") if default_form_data else "",
        "transport_destination": default_form_data.get("transport_destination", "") if default_form_data else "",
        "transport_position": default_form_data.get("transport_position", "Position of comfort") if default_form_data else "Position of comfort",
        "room_number": default_form_data.get("room_number", "") if default_form_data else "",
        "nurse_name": default_form_data.get("nurse_name", "") if default_form_data else "",
        "unit_in_service": default_form_data.get("unit_in_service", True) if default_form_data else True,
        "format_type": default_form_data.get("format_type", "D.R.A.T.T.") if default_form_data else "D.R.A.T.T.",
        "use_abbreviations": default_form_data.get("use_abbreviations", True) if default_form_data else True,
        "include_headers": default_form_data.get("include_headers", True) if default_form_data else True,
        "default_unit": default_form_data.get("default_unit", "") if default_form_data else "",
        "default_hospital": default_form_data.get("default_hospital", "") if default_form_data else "",
        "custom_format": default_form_data.get("custom_format", "") if default_form_data else "",
    })
    
    # Dropdown options
    response_delay_options = ["No response delays", "Weather", "Traffic", "Distance", "Directions", "Custom"]
    sex_options = ["Male", "Female", "Other"]
    gcs_score_options = [str(i) for i in range(15, 0, -1)]
    pupils_options = ["PERRL", "PERRLA", "Unequal", "Fixed", "Dilated", "Constricted"]
    pertinent_negatives_options = [
        "Chest pain", "Shortness of breath", "Dizziness", "Nausea", "Vomiting",
        "Headache", "Abdominal pain", "Back pain", "Loss of consciousness",
        "Weakness", "Numbness", "Tingling", "Vision changes", "Hearing changes"
    ]
    abnormal_vitals_options = [
        "Hypertensive", "Hypotensive", "Tachycardic", "Bradycardic",
        "Tachypneic", "Bradypneic", "Febrile", "Hypothermic", "Hypoxic"
    ]
    transport_position_options = [
        "Position of comfort", "Supine", "Fowler's", "Semi-Fowler's",
        "Left lateral recumbent", "Right lateral recumbent", "Trendelenburg"
    ]
    format_type_options = ["D.R.A.T.T.", "S.O.A.P.", "C.H.A.R.T.", "Custom"]
    
    def handle_submit(form_data):
        """Handle form submission."""
        if on_generate_narrative:
            on_generate_narrative(form_data)
    
    return rx.motion.div(
        rx.flex(
            # Generated Narrative Card
            rx.card(
                rx.card_content(
                    rx.heading("Generated Narrative", size="lg", mb="2"),
                    rx.text(narrative_text, whitespace="pre-wrap", size="sm"),
                    p="4",
                ),
                class_name="h-2/5 overflow-auto mb-2",
            ),
            
            # Form Area
            rx.box(
                rx.collapsible(
                    rx.flex(
                        rx.heading("EMS Narrative Form", size="lg"),
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
                                # Dispatch Section
                                rx.fieldset(
                                    rx.legend("Dispatch", font_weight="semibold", size="sm", px="2"),
                                    rx.grid(
                                        rx.vstack(
                                            rx.label("Unit"),
                                            rx.input(
                                                id="unit",
                                                value=form_data["unit"],
                                                on_change=lambda value: form_data.update({"unit": value}),
                                            ),
                                            spacing="1",
                                        ),
                                        rx.vstack(
                                            rx.label("Dispatch Reason"),
                                            rx.input(
                                                id="dispatch_reason",
                                                value=form_data["dispatch_reason"],
                                                on_change=lambda value: form_data.update({"dispatch_reason": value}),
                                            ),
                                            spacing="1",
                                        ),
                                        rx.vstack(
                                            rx.label("Response Delay"),
                                            rx.select(
                                                response_delay_options,
                                                id="response_delay",
                                                value=form_data["response_delay"],
                                                on_change=lambda value: form_data.update({"response_delay": value}),
                                            ),
                                            spacing="1",
                                            col_span=2,
                                        ),
                                        rx.cond(
                                            form_data["response_delay"] == "Custom",
                                            rx.vstack(
                                                rx.label("Custom Delay Reason"),
                                                rx.input(
                                                    id="response_delay_custom",
                                                    value=form_data["response_delay_custom"],
                                                    on_change=lambda value: form_data.update({"response_delay_custom": value}),
                                                ),
                                                spacing="1",
                                                col_span=2,
                                            ),
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
                                
                                # Patient Information Section
                                rx.fieldset(
                                    rx.legend("Patient Information", font_weight="semibold", size="sm", px="2"),
                                    rx.grid(
                                        rx.vstack(
                                            rx.label("Sex"),
                                            rx.select(
                                                sex_options,
                                                id="patient_sex",
                                                value=form_data["patient_sex"],
                                                on_change=lambda value: form_data.update({"patient_sex": value}),
                                            ),
                                            spacing="1",
                                        ),
                                        rx.vstack(
                                            rx.label("Age"),
                                            rx.input(
                                                id="patient_age",
                                                value=form_data["patient_age"],
                                                on_change=lambda value: form_data.update({"patient_age": value}),
                                            ),
                                            spacing="1",
                                        ),
                                        rx.vstack(
                                            rx.label("Chief Complaint"),
                                            rx.input(
                                                id="chief_complaint",
                                                value=form_data["chief_complaint"],
                                                on_change=lambda value: form_data.update({"chief_complaint": value}),
                                            ),
                                            spacing="1",
                                            col_span=2,
                                        ),
                                        rx.vstack(
                                            rx.label("Duration"),
                                            rx.input(
                                                id="duration",
                                                value=form_data["duration"],
                                                on_change=lambda value: form_data.update({"duration": value}),
                                            ),
                                            spacing="1",
                                        ),
                                        rx.vstack(
                                            rx.label("Patient Presentation"),
                                            rx.textarea(
                                                id="patient_presentation",
                                                value=form_data["patient_presentation"],
                                                on_change=lambda value: form_data.update({"patient_presentation": value}),
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
                                    mt="6",
                                ),
                                
                                # Submit Button
                                rx.button(
                                    "Generate Narrative",
                                    type="submit",
                                    width="100%",
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
                            value=narrative_text,
                            placeholder="Enter your narrative text here...",
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