import PyPDF2
import openai

openai.api_key = "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"
openai.organization = "org-rLLsbN71s2gi6Qp3oPUHXieH"

def extract_text_from_pdf(file_name):
    pdf_file_obj = open(file_name, 'rb')
    pdf_reader = PyPDF2.PdfReader(pdf_file_obj)

    text = ""
    for page_num in range(len(pdf_reader.pages)):
        page_obj = pdf_reader.pages[page_num]
        text += page_obj.extract_text()

    pdf_file_obj.close()
    return text

def create_lesson():
    file_name = 'lessoncontent/slidesexample.pdf'  
    raw_lesson_text = extract_text_from_pdf(file_name)

    create_lesson_messages = []
    create_lesson_messages.append({"role": "system", "content": '''You are a teacher that uses 
    raw data from in class lecture slides to create structured lessons that explain the topic in detail and in
    an understandable. The messages you provide will be 
    processed with python, so it is very important that you follow formatting directions carefully. Include all
    relevant information and you can include more that you know'''})
    
    create_lesson_messages.append({"role": "system", "content": '''Give your answer like your explaining to someone where canonese
    is their first language'''})
                                   
                                   
    create_lesson_messages.append({"role": "assistant", "content": raw_lesson_text})                         
    create_lesson_messages.append({"role": "assistant", "content": '''Using the above data, create a structured lesson
    that breaks it down into parts and explains information in a detailed and understandable way. Seperate your lesson into 
    clear sections and make sure each section is seperated by a <?!>'''})
    

    create_lesson_response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=create_lesson_messages,
        temperature=0.6
    )["choices"][0]["message"]["content"]

    lesson_parts = create_lesson_response.split('<?!>')

    for lesson_part in lesson_parts:
        print(lesson_part)


if __name__ == "__main__":
    create_lesson()