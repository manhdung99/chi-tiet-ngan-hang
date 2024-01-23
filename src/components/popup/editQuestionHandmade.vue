<template>
  <div v-if="question" class="custom-modal modal-center">
    <div class="add-new-handmade scroll">
      <div class="border-b px-4 py-4 flex justify-between">
        <span class="text-indigo font-bold">Chỉnh sửa câu hỏi</span>
        <span @click="closeEditModal()" class="cursor-pointer"
          ><img :src="closeIcon" alt=""
        /></span>
      </div>
      <div class="px-4 border-b scroll handmade-description">
        <div class="my-4">
          <label class="text-indigo font-semibold mb-2" for="tag-input"
            >Nội dung dán nhãn</label
          >
          <input
            id="tag-input"
            placeholder=""
            type="text"
            class="input w-full"
            v-model="question.TagsName"
          />
          <div
            v-if="isValidation && question.TagsName == ''"
            class="text-red-500 text-sm"
          >
            Chưa có nội dung dán nhãn
          </div>
        </div>
        <div class="my-4">
          <div class="text-indigo font-semibold mb-2">Dạng câu hỏi</div>
          <select
            @change="clearError"
            v-model="question.Type"
            class="w-full input"
            name=""
            id=""
          >
            <option value="QUIZ1">QUIZ1 : Chọn 1 đáp án đúng</option>
            <option value="QUIZ2">QUIZ2 : Điền từ</option>
            <option value="QUIZ3">QUIZ3 : Matching</option>
            <option value="QUIZ4">QUIZ4 : Chọn nhiều đáp án</option>
          </select>
        </div>
        <!-- Loại câu hỏi và mức độ  -->
        <div class="flex justify-between mb-4">
          <div class="w-1/2 mr-2">
            <div class="text-indigo font-semibold mb-2">Loại câu hỏi</div>
            <div>
              <select
                v-model="question.TypePart"
                class="input w-full"
                name=""
                id=""
              >
                <option value="1">Lý thuyết</option>
                <option value="2">Bài tập</option>
              </select>
            </div>
          </div>
          <div class="w-1/2 ml-2">
            <div class="text-indigo font-semibold mb-2">Mức độ</div>
            <div>
              <select
                v-model="question.LevelPart"
                class="input w-full"
                name=""
                id=""
              >
                <option value="1">Nhận biết</option>
                <option value="2">Thông hiểu</option>
                <option value="3">Vận dụng</option>
                <option value="4">Vận dụng cao</option>
              </select>
            </div>
          </div>
        </div>
        <!-- Tiêu đề -->
        <div class="flex justify-between mb-2 relative">
          <div class="w-full">
            <div class="text-indigo font-semibold mb-2">Tiêu đề</div>
            <div>
              <input
                v-model="question.Title"
                class="input w-full placeholder-gray-400"
                placeholder="Tiêu đề"
              />
            </div>
          </div>
        </div>
        <!-- Text edit  -->

        <div class="relative">
          <div class="text-indigo font-semibold mb-2">Nội dung câu hỏi</div>
          <CKEditorCustom
            :model-value="
              quiz2Description?.innerHTML ? quiz2Description?.innerHTML : ''
            "
            @update:model-value="(newValue:any) => (question.Description = newValue)"
          />
          <div
            v-if="questionArray.length > 0 && question.Type != 'QUIZ2'"
            class="mt-4"
          >
            <MultipleChoice
              v-for="(questionDetal, index) in questionArray"
              :key="questionDetal.ID"
              :index="index"
              :removeQuestion="removeQuestion"
              :question="questionDetal"
              :updateQuestionContent="updateQuestionContent"
              :updateQuestionAnswer="updateQuestionAnswer"
              :isValidation="isValidation"
            />
          </div>
        </div>
        <div v-if="question.Type != 'QUIZ2'" class="flex my-4">
          <button @click="addNewQuestion" class="mr-2 button small-button">
            Thêm câu hỏi
          </button>
          <!-- <button class="ml-2 button small-button">Thêm từ file excel</button> -->
        </div>
      </div>
      <!-- Bottom  -->
      <div class="flex justify-end px-4 pt-4 pb-1">
        <button @click="closeEditModal()" class="button mr-3 h-8">Đóng</button>
        <button @click="updateQuestionToList" class="button button-primary">
          Lưu
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import closeIcon from "../../assets/image/close-icon.svg";
import { usePopupStore } from "../../stores/popup";
import { useQuestionBankStore } from "../../stores/question-bank-store";
import { storeToRefs } from "pinia";
import MultipleChoice from "../questionType/MultipleChoice.vue";
import Question from "../../type/question";
import Answer from "../../type/answer";
import CKEditorCustom from "../custom/CKEditorCustom.vue";
import PartQuestion from "@/type/partQuestion";
import { addStaticLink } from "../../uses/addStaticLink";
import { changeMathJaxDes } from "../../uses/convertData";
import { convertStringNullToNull } from "../../uses/function";
import Media from "@/type/media";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default defineComponent({
  name: "EditQuestionHandmade",
  components: {
    MultipleChoice,
    CKEditorCustom,
  },
  props: {
    questionPart: {
      type: Object,
      required: true,
    },
    closeEditModal: {
      type: Function,
      required: true,
    },
    quiz2Description: {
      type: Element,
      required: true,
    },
  },
  setup(props) {
    const { updateAddNewQuestionHandmadeModalStatus } = usePopupStore();
    const { questionDeleteID, questionDeleteIndex, arrayAddnew, arrayUpdate } =
      storeToRefs(useQuestionBankStore());
    const { updateQuestionInQuestionList } = useQuestionBankStore();
    const editorData = ref("");
    const level = ref("1");
    const title = ref("");
    const isValidation = ref(false);
    const questionType = ref("1");
    const questionArray = ref<Question[]>([]);
    const question = ref<PartQuestion>();
    const addNewQuestion = () => {
      const id = "id" + Math.random().toString(16).slice(2);
      questionArray.value = [
        ...questionArray.value,
        {
          ID: id,
          Content: "",
          Media: null,
          Answers: [],
          Type: "",
          CloneAnswers: "",
          LevelPart: 1,
          TypePart: 1,
          Error: "",
        },
      ];
    };
    const removeQuestion = (id: string) => {
      questionArray.value = questionArray.value.filter(
        (question) => question.ID != id
      );
    };
    onMounted(() => {
      console.log(props.quiz2Description?.innerHTML);
    });
    const editorOptions = {
      // Quill options here
      modules: {
        toolbar: [
          // Include other toolbar options here
          [{ image: "true" }],
        ],
      },
    };
    const updateQuestionToList = () => {
      if (validateQuestion()) {
        const data = {
          ...question,
          Type: question.value?.Type as string,
          ID: question.value?.ID as string,
          Description: question.value?.Description as string,
          Media: question.value?.Media as Media | null,
          Title: question.value?.Title as string,
          Questions: questionArray.value,
          LevelPart: question.value?.LevelPart as number,
          TypePart: question.value?.TypePart as number,
          TagsName: question.value?.TagsName,
          ExamQuestionArchiveID: "",
        };
        updateQuestionInQuestionList(data);
        const questionInAddlist = arrayAddnew.value.find(
          (currentQuestion) => currentQuestion.ID == data.ID
        );
        if (questionInAddlist) {
          const partIndex = arrayAddnew.value.findIndex(
            (data) => data.ID == questionInAddlist.ID
          );
          arrayAddnew.value[partIndex] = data;
        } else {
          arrayUpdate.value = [...arrayUpdate.value, data];
        }
        props.closeEditModal();
      }
    };
    const updateQuestionContent = (id: string, content: string) => {
      const question = questionArray.value.find(
        (question) => question.ID == id
      );
      if (question) {
        question.Content = content;
      }
    };
    const updateQuestionAnswer = (id: string, answers: Array<Answer>) => {
      const question = questionArray.value.find(
        (question) => question.ID == id
      );
      if (question) {
        question.Answers = answers;
      }
    };
    const updateEditorData = (data: any) => {
      editorData.value = data;
    };
    const validateQuestion = () => {
      let validateData = true;
      isValidation.value = true;
      if (question.value?.TagsName == "") {
        return false;
      }
      if (question.value?.Type == "QUIZ1" || question.value?.Type == "QUIZ4") {
        if (questionArray.value.length > 0) {
          questionArray.value.forEach((questionDetail: Question) => {
            questionDetail.Error = "";
            if (questionDetail.Answers && questionDetail.Answers.length == 0) {
              questionDetail.Error = "Cần ít nhất 1 câu trả lời";
              validateData = false;
            } else {
              let trueAnswerTime = 0;
              questionDetail.Answers?.forEach((answer) => {
                if (answer.Content == "") {
                  questionDetail.Error = "Câu trả lời không được để trống";
                  validateData = false;
                } else if (answer.IsCorrect) {
                  if (question.value?.Type == "QUIZ4") {
                    validateData = true;
                    trueAnswerTime = trueAnswerTime + 1;
                  } else {
                    validateData = true;
                    trueAnswerTime = trueAnswerTime + 1;
                    console.log(trueAnswerTime);

                    if (trueAnswerTime > 1) {
                      questionDetail.Error =
                        "QUIZ 1 chỉ có 1 đáp án đúng cho 1 câu hỏi";
                      validateData = false;
                    }
                  }
                }
              });
              if (trueAnswerTime == 0) {
                questionDetail.Error =
                  questionDetail.Error == ""
                    ? "Chưa có câu trả lời đúng"
                    : questionDetail.Error;
                validateData = false;
              }
            }
          });
        } else {
          alert("Cần ít nhất 1 câu hỏi");
          validateData = false;
        }
      }
      return validateData;
    };
    const clearError = () => {
      isValidation.value = false;
    };
    onMounted(() => {
      // Set the question ref to a deep copy of props.questionPart
      question.value = JSON.parse(JSON.stringify(props.questionPart));
      convertStringNullToNull(question.value);
      if (question.value) {
        question.value.Description = addStaticLink(question.value.Description);
        question.value.Description = changeMathJaxDes(
          question.value.Description
        );
        question.value.Questions.forEach((questionDetail) => {
          questionDetail.Content = changeMathJaxDes(questionDetail.Content);
          questionDetail.Answers.forEach((answer: Answer) => {
            answer.Content = changeMathJaxDes(answer.Content);
          });
        });
      }
      questionArray.value = question.value?.Questions as Question[];
    });

    return {
      closeIcon,
      questionDeleteID,
      questionDeleteIndex,
      editorData,
      editorOptions,
      questionArray,
      title,
      level,
      questionType,
      arrayAddnew,
      isValidation,
      question,
      updateAddNewQuestionHandmadeModalStatus,
      addNewQuestion,
      removeQuestion,
      updateQuestionToList,
      updateQuestionContent,
      updateQuestionAnswer,
      updateEditorData,
      clearError,
    };
  },
});
</script>
<style>
.add-new-handmade {
  max-height: 100vh;
  background: white;
  width: 800px;
  border: 1px solid #00000032;
  border-radius: 4px;
}
.add-new-handmade p {
  margin: 0;
}
.ql-container.ql-snow {
  min-height: 200px;
}
.small-button {
  background: #3b82f6;
  color: white;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.small-button:hover {
  background: #1e40af;
}
.add-new-handmade .small-button {
  height: 32px;
}
</style>
../../cke
