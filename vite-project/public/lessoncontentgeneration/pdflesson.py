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
    that breaks it down into parts and explains information in a step-by-step manner with great detail in each section. Seperate your lesson into 
    clear sections and mark the end of each section with a <?!> We will use this for seperating sections later with code.'''})
    

    create_lesson_response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=create_lesson_messages,
        temperature=0.6
    )["choices"][0]["message"]["content"]

    lesson_parts = create_lesson_response.split('<?!>')

    with open('generatedlessoncontent.txt', 'w') as file:
        for lesson_part in lesson_parts:
            file.write(lesson_part)
            file.write('<?!>')  # add a separator between sections
    print("Generation Finished")



if __name__ == "__main__":
    create_lesson()