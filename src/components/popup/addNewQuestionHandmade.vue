<template>
  <div class="custom-modal center">
    <div class="add-new-handmade scroll-area">
      <div class="border-b px-4 py-4 flex justify-between">
        <span class="text-indigo font-bold">Thêm câu hỏi</span>
        <span
          @click="updateAddNewQuestionHandmadeModalStatus(false)"
          class="cursor-pointer"
          ><img :src="closeIcon" alt=""
        /></span>
      </div>
      <div class="px-4 border-b">
        <div class="my-4">
          <select v-model="type" class="w-full input" name="" id="">
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
              <select v-model="questionType" class="input w-full" name="" id="">
                <option value="1">Lý thuyết</option>
                <option value="2">Bài tập</option>
              </select>
            </div>
          </div>
          <div class="w-1/2 ml-2">
            <div class="text-indigo font-semibold mb-2">Mức độ</div>
            <div>
              <select v-model="level" class="input w-full" name="" id="">
                <option value="1">Nhận biết</option>
                <option value="2">Thông hiểu</option>
                <option value="3">Vận dụng</option>
                <option value="4">Vận dụng cao</option>
              </select>
            </div>
          </div>
        </div>
        <!-- Tiêu đề -->
        <div class="flex justify-between mb-4">
          <div class="w-full">
            <div class="text-indigo font-semibold mb-2">Tiêu đề</div>
            <div>
              <input
                v-model="title"
                class="input w-full placeholder-gray-400"
                placeholder="Tiêu đề"
              />
            </div>
          </div>
        </div>
        <!-- Text edit  -->

        <div>
          <div class="text-indigo font-semibold mb-2">Nội dung câu hỏi</div>
          <CKEditorCustom
            :model-value="editorData"
            @update:model-value="(newValue:any) => (editorData = newValue)"
          />
          <!-- <QuillEditor
            contentType="html"
            v-model:content="editerData"
            toolbar="full"
            ref="editor"
            theme="snow"
          /> -->
          <div v-if="questionArray.length > 0" class="mt-4">
            <MultipleChoice
              v-for="(question, index) in questionArray"
              :key="question.ID"
              :index="index"
              :removeQuestion="removeQuestion"
              :question="question"
              :updateQuestionContent="updateQuestionContent"
              :updateQuestionAnswer="updateQuestionAnswer"
            />
          </div>
        </div>
        <div v-if="type != 'QUIZ2'" class="flex my-4">
          <button @click="addNewQuestion" class="mr-2 button small-button">
            Thêm câu hỏi
          </button>
          <button class="ml-2 button small-button">Thêm từ file excel</button>
        </div>
      </div>
      <!-- Bottom  -->
      <div class="flex justify-end px-4 pt-4 pb-1">
        <button
          @click="updateAddNewQuestionHandmadeModalStatus(false)"
          class="button mr-3 h-8"
        >
          Đóng
        </button>
        <button @click="addQuestionToList" class="button button-primary">
          Lưu
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import closeIcon from "../../assets/image/close-icon.svg";
import { usePopupStore } from "../../stores/popup";
import { useQuestionBankStore } from "../../stores/question-bank-store";
import { storeToRefs } from "pinia";
import MultipleChoice from "../questionType/MultipleChoice.vue";
import Question from "../../type/question";
import Answer from "../../type/answer";
import CKEditorCustom from "../custom/CKEditorCustom.vue";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default defineComponent({
  name: "AddNewQuestionHandmade",
  components: {
    MultipleChoice,
    CKEditorCustom,
  },
  setup() {
    const { updateAddNewQuestionHandmadeModalStatus } = usePopupStore();
    const { questionDeleteID, questionDeleteIndex } = storeToRefs(
      useQuestionBankStore()
    );
    const { addQuestionToCurrentList } = useQuestionBankStore();
    const editorData = ref("");
    const type = ref("QUIZ1");
    const level = ref("1");
    const title = ref("");
    const questionType = ref("1");
    const questionArray = ref<Question[]>([]);
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
          LevelPart: 0,
          TypePart: 0,
        },
      ];
    };
    const removeQuestion = (id: string) => {
      questionArray.value = questionArray.value.filter(
        (question) => question.ID != id
      );
    };

    const editorOptions = {
      // Quill options here
      modules: {
        toolbar: [
          // Include other toolbar options here
          [{ image: "true" }],
        ],
      },
    };
    const addQuestionToList = () => {
      const data = {
        Type: type.value,
        ID: Math.random().toString(16).slice(2),
        Description: editorData.value,
        Media: null,
        Title: title.value,
        Questions: questionArray.value,
        LevelPart: Number.parseInt(level.value),
        TypePart: Number.parseInt(questionType.value),
      };
      addQuestionToCurrentList([data]);
      updateAddNewQuestionHandmadeModalStatus(false);
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
    return {
      closeIcon,
      questionDeleteID,
      questionDeleteIndex,
      editorData,
      editorOptions,
      questionArray,
      type,
      title,
      level,
      questionType,
      updateAddNewQuestionHandmadeModalStatus,
      addNewQuestion,
      removeQuestion,
      addQuestionToList,
      updateQuestionContent,
      updateQuestionAnswer,
      updateEditorData,
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
