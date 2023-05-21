import pdfplumber
import openai
import os
import glob
import sys

file_path = sys.argv[1]
language = sys.argv[2]

openai.api_key = "API KEY HERE"
openai.organization = "org-rLLsbN71s2gi6Qp3oPUHXieH"

def extract_text_from_pdf(file_name):
    with pdfplumber.open(file_name) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text

def add_h1_tags(text):
    lines = text.split('\n')
    modified_lines = []
    
    for index, line in enumerate(lines):
        if (index != 0 and index != 1) and line.startswith('#'):
            modified_lines.append('<?!>' + line)
        else:
            modified_lines.append(line)
    
    return '\n'.join(modified_lines)

def create_lesson():
    # Get all pdf files in the 'uploads' directory
    pdf_files = glob.glob('uploads/*.pdf')

    raw_lesson_text = ""
    for file_name in pdf_files:
        raw_lesson_text += extract_text_from_pdf(file_name)
    
    print("Generation Started")
        
    create_lesson_messages = []
    create_lesson_messages.append({"role": "system", "content": '''You are a teacher that uses 
    raw data from in class lecture slides to create structured lessons that explain the topic in detail and separated 
    into clear sections. The messages you provide will be 
    processed with python, so it is very important that you follow formatting directions carefully. 
    Give your answers in raw mdx code and make sure to 
    emphasize words in bold with ** bold word **. use h2s (##) for the
    start of every section. You are incapable of producing h3 (###)'''})
                                    
    create_lesson_messages.append({"role": "user", "content": raw_lesson_text})                         
    create_lesson_messages.append({"role": "user", "content": '''Using the above data, create a structured lesson
    that breaks it down into clear sections and explains information in a step-by-step manner with great detail in each section. Separate your lesson into 
    clear sections. We will use this for separating sections later with code. There
    should be a different section for each subtopic Enter your
    final answer in raw mdx code and emphasize key words in bold with ** bold word **. Use h2 (##) for the
    start of every section. DO NOT use any h3 (###)'''})
    if language != 'English':
        create_lesson_messages.append({"role": "user", "content": "GIve your answer in " + language})
    
    if language != 'English':
        create_lesson_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=create_lesson_messages,
            temperature=0.6
        )["choices"][0]["message"]["content"]
    else:
        create_lesson_response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=create_lesson_messages,
        temperature=0.6
    )["choices"][0]["message"]["content"]
        
    create_lesson_response = create_lesson_response.strip() + '\n'
    lesson_parts = add_h1_tags(create_lesson_response)

    with open('public/generatedlessoncontent.txt', 'w', encoding='utf-8') as file:
        for lesson_part in lesson_parts:
            file.write(lesson_part)

    print("Generation Finished")

if __name__ == "__main__":
    create_lesson()