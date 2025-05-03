"""
End-to-End Tests for EZ Narratives
=================================

This module contains end-to-end tests for the EZ Narratives application.
These tests use Puppeteer to automate browser interactions and verify
the application's functionality from a user's perspective.
"""

import os
import sys
import pytest
import asyncio
from dotenv import load_dotenv
from pyppeteer import launch

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv(".env.local")


@pytest.mark.asyncio
async def test_login_flow():
    """Test the login flow."""
    # Launch the browser
    browser = await launch(headless=True)
    page = await browser.newPage()
    
    try:
        # Navigate to the login page
        await page.goto('http://localhost:3004/login')
        
        # Wait for the page to load
        await page.waitForSelector('input[id="email"]')
        
        # Fill in the login form
        await page.type('input[id="email"]', 'test@example.com')
        await page.type('input[id="password"]', 'password123')
        
        # Click the login button
        login_button = await page.querySelector('button[type="submit"]')
        await login_button.click()
        
        # Wait for navigation to dashboard
        await page.waitForNavigation()
        
        # Verify that we're on the dashboard page
        current_url = page.url
        assert '/dashboard' in current_url, f"Expected to be on dashboard page, but got {current_url}"
        
    finally:
        # Close the browser
        await browser.close()


@pytest.mark.asyncio
async def test_ems_narrative_generation():
    """Test generating an EMS narrative."""
    # Launch the browser
    browser = await launch(headless=True)
    page = await browser.newPage()
    
    try:
        # Log in first
        await page.goto('http://localhost:3004/login')
        await page.waitForSelector('input[id="email"]')
        await page.type('input[id="email"]', 'test@example.com')
        await page.type('input[id="password"]', 'password123')
        login_button = await page.querySelector('button[type="submit"]')
        await login_button.click()
        await page.waitForNavigation()
        
        # Navigate to the EMS tab
        ems_tab = await page.querySelector('button:has-text("EMS")')
        await ems_tab.click()
        
        # Wait for the EMS form to load
        await page.waitForSelector('input[id="unit"]')
        
        # Fill in the EMS form
        await page.type('input[id="unit"]', 'Medic 1')
        await page.type('input[id="dispatch_reason"]', '123 Main St for chest pain')
        await page.select('select[id="patient_sex"]', 'Male')
        await page.type('input[id="patient_age"]', '65')
        await page.type('input[id="chief_complaint"]', 'Chest pain')
        
        # Click the generate narrative button
        generate_button = await page.querySelector('button:has-text("Generate Narrative")')
        await generate_button.click()
        
        # Wait for the narrative to be generated
        await page.waitForFunction(
            'document.querySelector("div.narrative-text").textContent.includes("EMS NARRATIVE")',
            {'timeout': 10000}
        )
        
        # Verify that a narrative was generated
        narrative_text = await page.evaluate('document.querySelector("div.narrative-text").textContent')
        assert "EMS NARRATIVE" in narrative_text, "Expected EMS narrative to be generated"
        
    finally:
        # Close the browser
        await browser.close()


@pytest.mark.asyncio
async def test_fire_narrative_generation():
    """Test generating a Fire narrative."""
    # Launch the browser
    browser = await launch(headless=True)
    page = await browser.newPage()
    
    try:
        # Log in first
        await page.goto('http://localhost:3004/login')
        await page.waitForSelector('input[id="email"]')
        await page.type('input[id="email"]', 'test@example.com')
        await page.type('input[id="password"]', 'password123')
        login_button = await page.querySelector('button[type="submit"]')
        await login_button.click()
        await page.waitForNavigation()
        
        # Navigate to the Fire tab
        fire_tab = await page.querySelector('button:has-text("Fire")')
        await fire_tab.click()
        
        # Wait for the Fire form to load
        await page.waitForSelector('input[id="unit"]')
        
        # Fill in the Fire form
        await page.type('input[id="unit"]', 'Engine 3')
        await page.select('select[id="emergency_type"]', 'Structure Fire')
        await page.type('textarea[id="additional_info"]', 'Two-story residential structure with heavy smoke showing from second floor.')
        
        # Click the generate report button
        generate_button = await page.querySelector('button:has-text("Generate NFIRS Report")')
        await generate_button.click()
        
        # Wait for the report to be generated
        await page.waitForFunction(
            'document.querySelector("div.narrative-text").textContent.includes("FIRE INCIDENT REPORT")',
            {'timeout': 10000}
        )
        
        # Verify that a report was generated
        report_text = await page.evaluate('document.querySelector("div.narrative-text").textContent')
        assert "FIRE INCIDENT REPORT" in report_text, "Expected Fire report to be generated"
        
    finally:
        # Close the browser
        await browser.close()


@pytest.mark.asyncio
async def test_chat_functionality():
    """Test the chat functionality."""
    # Launch the browser
    browser = await launch(headless=True)
    page = await browser.newPage()
    
    try:
        # Log in first
        await page.goto('http://localhost:3004/login')
        await page.waitForSelector('input[id="email"]')
        await page.type('input[id="email"]', 'test@example.com')
        await page.type('input[id="password"]', 'password123')
        login_button = await page.querySelector('button[type="submit"]')
        await login_button.click()
        await page.waitForNavigation()
        
        # Navigate to the Chat tab (should be default)
        chat_tab = await page.querySelector('button:has-text("Chat")')
        await chat_tab.click()
        
        # Wait for the chat input to load
        await page.waitForSelector('textarea[placeholder*="Type your message"]')
        
        # Send a message
        await page.type('textarea[placeholder*="Type your message"]', 'Hello, can you help me with an EMS narrative?')
        send_button = await page.querySelector('button[aria-label="Send message"]')
        await send_button.click()
        
        # Wait for a response
        await page.waitForFunction(
            'document.querySelectorAll("div.message").length > 1',
            {'timeout': 10000}
        )
        
        # Verify that a response was received
        messages = await page.evaluate('Array.from(document.querySelectorAll("div.message")).map(m => m.textContent)')
        assert len(messages) > 1, "Expected at least one response message"
        
    finally:
        # Close the browser
        await browser.close()


if __name__ == "__main__":
    # Run the tests
    pytest.main(["-xvs", __file__])