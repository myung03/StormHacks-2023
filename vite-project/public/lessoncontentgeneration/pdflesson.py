import pdfplumber
import openai

openai.api_key = "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"
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
    file_name = 'lessoncontent/slidesexample.pdf'  
    raw_lesson_text = extract_text_from_pdf(file_name)

    create_lesson_messages = []
    create_lesson_messages.append({"role": "system", "content": '''You are a teacher that uses 
    raw data from in class lecture slides to create structured lessons that explain the topic in detail and separated 
    into clear sections. The messages you provide will be 
    processed with python, so it is very important that you follow formatting directions carefully. 
    Give your answers in raw mdx code and make sure to 
    emphasize words in bold with ** bold word **. use h2s (##) for the
    for the start of every section. You are incabable of producing h3 (###)'''})
    
                                   
                                   
    create_lesson_messages.append({"role": "assistant", "content": raw_lesson_text})                         
    create_lesson_messages.append({"role": "assistant", "content": '''Using the above data, create a structured lesson
    that breaks it down into clear sections and explains information in a step-by-step manner with great detail in each section. Separate your lesson into 
    clear sections. We will use this for separating sections later with code. There
    should be a different section for each subtopic Enter your
    final answer in raw mdx code and emphasize key words in bold with ** bold word **. Use h2 (##) for the
    start of every section. DO NOT use any h3 (###)'''})
    

    create_lesson_response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=create_lesson_messages,
        temperature=0.6
    )["choices"][0]["message"]["content"]

    create_lesson_response = create_lesson_response.strip() + '\n'
    lesson_parts = add_h1_tags(create_lesson_response)



    with open('generatedlessoncontent.txt', 'w', encoding='utf-8') as file:
        for lesson_part in lesson_parts:
            file.write(lesson_part)

    print("Generation Finished")

if __name__ == "__main__":
    create_lesson()