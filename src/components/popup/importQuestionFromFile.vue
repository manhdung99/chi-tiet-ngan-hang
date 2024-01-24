<template>
  <div class="custom-modal modal-center">
    <div
      v-if="!fileImported"
      class="bg-white rounded-sm select-question-from-bank relative p-4"
    >
      <div
        class="swal2-icon swal2-question swal2-icon-show"
        style="display: flex"
      >
        <div class="swal2-icon-content">?</div>
      </div>
      <h2 class="swal2-title" id="swal2-title">Chọn thao tác</h2>
      <div class="flex">
        <label
          class="button flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white mr-2"
          for="import-input"
          ><span><img class="w-6- h-6 mr-2" :src="uploadIcon" alt="" /></span>
          Tải từ đề</label
        >
        <label
          class="button flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white mr-2"
          for="import-input"
          ><span><img class="w-6- h-6 mr-2" :src="uploadIcon" alt="" /></span>
          Chọn file Word</label
        >
        <a
          href="/eduso/teacher/LessonPartExam/ExportTemplate"
          class="button text-white bg-gray-400 hover:bg-gray-500 flex mr-2"
          ><span
            ><img class="w-6- h-6" :src="downloadDocumentIcon" alt="" /></span
          >Tải file mẫu</a
        >
      </div>
      <div class="swal2-actions">
        <button
          @click="updateOpenImportFromFileModalStatus(false)"
          type="button"
          class="swal2-confirm swal2-styled hover:bg-blue-700"
          aria-label=""
          style="
            display: inline-block;
            border-left-color: rgb(48, 133, 214);
            border-right-color: rgb(48, 133, 214);
          "
        >
          Đóng
        </button>
      </div>

      <input
        id="import-input"
        class="hidden"
        type="file"
        @change="handleFileChange"
      />
    </div>
    <div
      v-else
      class="bg-white rounded-sm select-question-from-bank h-screen w-full relative"
    >
      <div class="select-bank-modal-content-part2">
        <div
          class="flex items-center justify-between text-indigo text-lg border-b p-4 relative"
        >
          <div class="flex w-full justify-between mr-6 items-center">
            <span class="flex"
              >Câu hỏi đã chọn
              <span v-if="currentListPartQuestion.length > 0" class="flex ml-8">
                <span
                  ><input
                    :checked="checkAll"
                    class="cursor-pointer"
                    @click="checkAllQuestion()"
                    type="checkbox"
                /></span>
                <span class="ml-4">Chọn tất cả</span>
              </span>
            </span>

            <div class="flex items-center">
              <button
                @click="validatelistSelectedQuestion"
                class="button button-primary text-sm mr-4"
              >
                Kiểm tra lỗi
              </button>
              <span class="text-sm font-semibold cursor-pointer hover:underline"
                >Đã chọn {{ currentQuestionPartSelected.length }} câu</span
              >
            </div>
          </div>
        </div>
        <div class="list-import-question scroll">
          <!-- Câu hỏi của ngân hàng  -->
          <div class="flex-1">
            <div class="h-full">
              <div
                class="list-question-part scroll h-full"
                v-if="currentListPartQuestion.length > 0"
              >
                <div
                  v-for="(question, index) in currentListPartQuestion"
                  :key="question.ID"
                  class="flex items-center w-full"
                >
                  <div class="mr-2">
                    <input
                      :checked="
                        currentSelectedPartQuestionsID.includes(question.ID)
                      "
                      @click="updateListSelectedQuestion(question)"
                      class="cursor-pointer"
                      type="checkbox"
                    />
                  </div>
                  <selectedQuestionBank
                    :questionPart="question"
                    :index="index"
                    :answerListQuiz2="answerListQuiz2"
                    class="border flex-1"
                    :removeQuestionInListSelected="removeQuestionInListSelected"
                  />
                </div>
              </div>
              <div
                class="text-red-500 text-sm font-semibold ml-2"
                v-if="currentListPartQuestion.length == 0 && !isLoading"
              >
                Không có dữ liệu
              </div>
            </div>
          </div>
        </div>
        <div class="flex p-2.5 justify-end border-t absolute bottom-0 w-full">
          <button
            @click="updateOpenImportFromFileModalStatus(false)"
            class="text-white text-sm bg-red-500 px-4 py-2 rounded mr-1 hover:opacity-80"
          >
            Huỷ
          </button>
          <button
            @click="saveData"
            class="text-white text-sm bg-blue-700 px-4 py-2 rounded ml-1 hover:opacity-80"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import inboxIcon from "../../assets/image/noun-inbox.svg";
import closeIcon from "../../assets/image/close-icon.svg";
import { usePopupStore } from "@/stores/popup";
import { storeToRefs } from "pinia";
import selectedQuestionBank from "../question/selectedQuestionBank/questionSelectedBank.vue";
import PartQuestion from "../../type/partQuestion";
import { useQuestionBankStore } from "@/stores/question-bank-store";
import { addStaticLink } from "../../uses/addStaticLink";
import Answer from "../../type/answer";
import Question from "../../type/question";
import { validateQuestion } from "../../uses/function";
import uploadIcon from "../../assets/image/upload-icon.svg";
import downloadDocumentIcon from "../../assets/image/download-document.svg";
import axios from "axios";
export default defineComponent({
  name: "ImportFromFile",
  components: {
    selectedQuestionBank,
  },
  setup() {
    const { updateLoading, updateOpenImportFromFileModalStatus } =
      usePopupStore();
    const { isLoading } = storeToRefs(usePopupStore());
    const { addQuestionToCurrentList } = useQuestionBankStore();
    const { arrayAddnew } = storeToRefs(useQuestionBankStore());
    const answerListQuiz2 = ref<Answer[]>([]);
    const checkAll = ref(false);
    const fileImported = ref(false);
    const currentSelectedPartQuestionsID = ref<Array<string>>([]);
    const saveData = () => {
      addQuestionToCurrentList(currentQuestionPartSelected.value);
      arrayAddnew.value = [
        ...arrayAddnew.value,
        ...currentQuestionPartSelected.value,
      ];
      currentQuestionPartSelected.value = [];
      updateOpenImportFromFileModalStatus(false);
    };
    const currentListPartQuestion = ref<Array<PartQuestion>>([]);
    const currentQuestionPartSelected = ref<Array<PartQuestion>>([]);
    const updateListSelectedQuestion = (partQuestions: PartQuestion) => {
      if (currentQuestionPartSelected.value.length > 0) {
        if (currentSelectedPartQuestionsID.value.includes(partQuestions.ID)) {
          currentQuestionPartSelected.value =
            currentQuestionPartSelected.value.filter(
              (question) => question.ID != partQuestions.ID
            );
        } else {
          currentQuestionPartSelected.value = [
            partQuestions,
            ...currentQuestionPartSelected.value,
          ];
        }
      } else {
        currentQuestionPartSelected.value = [
          partQuestions,
          ...currentQuestionPartSelected.value,
        ];
      }
    };
    const removeQuestionInListSelected = (id: string) => {
      currentQuestionPartSelected.value =
        currentQuestionPartSelected.value.filter(
          (question) => question.ID != id
        );
    };
    const createListAnswerQuiz2 = () => {
      currentListPartQuestion.value.forEach((part) => {
        if (part.Type == "QUIZ2") {
          part.Questions.forEach((questionData: Question) => {
            if (questionData.Answers) {
              questionData.Answers.forEach((answer) => {
                answerListQuiz2.value = [...answerListQuiz2.value, answer];
              });
            }
          });
        }
      });
    };
    const validatelistSelectedQuestion = async () => {
      const data = await validateQuestion(currentListPartQuestion.value);
      currentListPartQuestion.value = data;
    };
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const handleFileChange = async (event: any) => {
      updateLoading(true);
      fileImported.value = true;
      const file = event.target.files[0];
      // Create a FormData object and append the file to it
      const formData = new FormData();
      formData.append("file", file);
      // Make the API call using axios
      await axios
        .post(
          process.env.VUE_APP_BASE_URL + process.env.VUE_APP_IMPORT_FILE,
          formData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          currentListPartQuestion.value = response.data.Data;
          currentListPartQuestion.value.forEach((part) => {
            part.Description = addStaticLink(part.Description);
          });
          createListAnswerQuiz2();
          // Handle the response as needed
        })
        .catch((error) => {
          console.error("Failed to upload file:", error);
          updateLoading(false);
          // Handle errors
        });
      updateLoading(false);
    };
    const checkAllQuestion = () => {
      checkAll.value = !checkAll.value;
      if (checkAll.value) {
        if (currentQuestionPartSelected.value.length == 0) {
          currentQuestionPartSelected.value = [
            ...currentListPartQuestion.value,
          ];
        } else {
          currentListPartQuestion.value.forEach((part) => {
            if (!currentSelectedPartQuestionsID.value.includes(part.ID)) {
              currentQuestionPartSelected.value = [
                ...currentQuestionPartSelected.value,
                part,
              ];
            }
          });
        }
      } else {
        currentListPartQuestion.value.forEach((part) => {
          if (currentSelectedPartQuestionsID.value.includes(part.ID)) {
            currentQuestionPartSelected.value =
              currentQuestionPartSelected.value.filter(
                (selectedPart) => part.ID != selectedPart.ID
              );
          }
        });
      }
    };
    watch(currentQuestionPartSelected, () => {
      currentSelectedPartQuestionsID.value =
        currentQuestionPartSelected.value.map(
          (question) => question.ID as string
        );
    });
    return {
      closeIcon,
      inboxIcon,
      currentListPartQuestion,
      currentQuestionPartSelected,
      currentSelectedPartQuestionsID,
      answerListQuiz2,
      fileImported,
      uploadIcon,
      downloadDocumentIcon,
      isLoading,
      checkAll,
      updateListSelectedQuestion,
      saveData,
      removeQuestionInListSelected,
      validatelistSelectedQuestion,
      handleFileChange,
      updateOpenImportFromFileModalStatus,
      checkAllQuestion,
    };
  },
});
</script>
<style>
.swal2-icon {
  position: relative;
  box-sizing: content-box;
  justify-content: center;
  width: 5em;
  height: 5em;
  margin: 1.25em auto 1.875em;
  border: 0.25em solid transparent;
  border-radius: 50%;
  font-family: inherit;
  line-height: 5em;
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.swal2-icon.swal2-question {
  border-color: #c9dae1;
  color: #87adbd;
}
[class^="swal2"] {
  -webkit-tap-highlight-color: transparent;
}
.swal2-icon .swal2-icon-content {
  display: flex;
  align-items: center;
  font-size: 3.75em;
}
.swal2-title {
  position: relative;
  max-width: 100%;
  margin: 0 0 0.4em;
  padding: 0;
  color: #595959;
  font-size: 1.875em;
  font-weight: 600;
  text-align: center;
  text-transform: none;
  word-wrap: break-word;
}
.swal2-styled.swal2-confirm {
  border: 0;
  border-radius: 0.25em;
  background: initial;
  background-color: #3085d6;
  color: #fff;
  font-size: 1.0625em;
}
.swal2-styled {
  margin: 0.3125em;
  padding: 0.625em 2em;
  box-shadow: none;
  font-weight: 500;
}
.swal2-actions {
  display: flex;
  z-index: 1;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1.25em auto 0;
}
.list-import-question {
  height: calc(100vh - 160px);
  padding: 16px;
}
</style>
