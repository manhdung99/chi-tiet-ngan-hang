import PartQuestion from "../type/partQuestion";
import Question from "../type/question";
import axios, { AxiosResponse } from "axios";
export function uploadImage(loader: any) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        loader.file.then(async (file: any) => {
          try {
            if (!file) return;
            const response = await uploadImageAPI(file);
            if (response) {
              resolve({ default: response });
            }
          } catch (error) {
            console.log(error);
          }
        });
      });
    },
  };
}
export async function uploadImageAPI(img: any) {
  const form = new FormData();
  form.append("image", img);

  const apiKey = "ba0e49c8e622fdf96c435c48c858263c"; // Replace with your ImgBB API key
  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  try {
    const response: AxiosResponse = await axios.post(url, form);

    if (response.status === 200) {
      // Image upload was successful
      const img_url = response.data.data.url;
      console.log("Image URL:", img_url);
      return img_url;
    } else {
      console.error("Image upload failed. Response status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error uploading the image:", error);
    return null;
  }
}
export function generateRandomHexId() {
  const characters = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
}
export async function validateQuestion(partQuestions: PartQuestion[]) {
  partQuestions = partQuestions.map((part) => {
    if (part.Type == "QUIZ1" || part.Type == "QUIZ4") {
      if (part.Questions.length > 0) {
        part.Questions.forEach((question: Question) => {
          if (question.Answers && question.Answers.length == 0) {
            part = { ...part, validateError: true };
          } else {
            part = { ...part, validateError: true };
            let trueAnswerTime = 0;
            question.Answers?.forEach((answer) => {
              if (answer.IsCorrect) {
                if (part.Type == "QUIZ4") {
                  part = { ...part, validateError: false };
                } else {
                  part = { ...part, validateError: false };
                  trueAnswerTime = trueAnswerTime + 1;
                  if (trueAnswerTime > 1) {
                    part = { ...part, validateError: true };
                  }
                }
              }
            });
          }
        });
      } else {
        part = { ...part, validateError: true };
        partQuestions = [part, ...partQuestions];
      }
    }
    return part;
  });
  partQuestions = partQuestions.sort((a, b) => {
    if (a.validateError === b.validateError) {
      return 0;
    } else if (a.validateError) {
      return -1;
    } else {
      return 1;
    }
  });
  const numberErrorQuestions = partQuestions.filter(
    (question) => question.validateError == true
  );
  if (numberErrorQuestions.length > 0) {
    alert(`Có ${numberErrorQuestions.length} câu hỏi lỗi`);
  } else {
    alert("Không có câu hỏi lỗi");
  }
  return partQuestions;
}
