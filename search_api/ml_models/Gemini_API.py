import os
import google.generativeai as genai

# Function to configure the Gemini model
def load_gemini_model(api_key = "AIzaSyA8WwzPqCteQEzFCjldDkLmCByNR_7uNIU"):
    os.environ["API_KEY"] = api_key
    genai.configure(api_key=os.environ["API_KEY"])
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    return gemini_model


# Function to process the query with Gemini
def process_query_with_gemini(gemini_query, gemini_model):
    # Call the relevant model based on the user's query

    # Prepare concatenated data for the prompt
    concatenated_data = '\n\n'.join([', '.join([f'{key}: {value}' for key, value in item.items()]) for item in gemini_query])

    # Create the prompt for rephrasing
    prompt = f"Rephrase the cases details in chatbot reply format \n\nDATA:\n{concatenated_data}"

    # Generate rephrased content using the Gemini model
    response = gemini_model.generate_content(prompt)

    return response.text