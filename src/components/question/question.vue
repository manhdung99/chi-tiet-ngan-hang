<template>
  <!-- Default  -->
  <div
    v-if="question"
    :class="question.validateError ? 'border-red-500 border' : ''"
    class="bg-white rounded-md question-detail mb-4 relative"
  >
    <div
      :class="question.validateError ? '' : 'hidden'"
      class="absolute text-red-500 left-1/2 top-2 text-sm"
    >
      Câu hỏi lỗi
    </div>
    <div
      class="p-3 flex items-center justify-between border-b border-grey-lighter"
    >
      <span class="text-sm font-semibold"
        >{{ index + 1 }}. Câu hỏi số {{ index + 1 }}</span
      >
      <span class="text-sm text-black-lighter"
        >{{ question.TypePart == 1 ? "Lý thuyết" : "Bài tập" }} |
        {{
          question.LevelPart == 1
            ? "Nhận biết"
            : question.LevelPart == 2
            ? "Thông hiểu"
            : "Vận dụng"
        }}
        |
        {{
          question.Type == "QUIZ1"
            ? "Chọn một"
            : question.Type == "QUIZ2"
            ? "Điền từ"
            : question.Type == "QUIZ3"
            ? "Matching"
            : question.Type == "QUIZ4"
            ? "Chọn nhiều"
            : "Tự luận"
        }}</span
      >
    </div>
    <!-- Default  -->
    <div
      v-show="!showDetail && !showAll"
      class="p-4 text-sm text-gray-600 flex justify-between"
    >
      <span
        class="max-w-4/5"
        v-if="
          question.Title != 'null' &&
          question.Description != 'null' &&
          (question.Title != null || question.Description != null)
        "
      >
        <span v-if="question.Title" v-html="question.Title"></span>
        <span class="ellipsis" v-else v-html="question.Description"></span>
      </span>
      <span class="max-w-4/5" v-else v-html="question.Questions[0].Content">
      </span>
      <div class="flex">
        <span
          @click="showDetail = true"
          class="mr-2 cursor-pointer flex items-end"
        >
          <img :src="eyeIcon" alt="" />
        </span>
        <span
          @click="
            questionDuplicateID = question.ID;
            questionDuplicateIndex = index as number;
            updateDuplicateQuestionModalStatus(true, 'mainQuestion');
          "
          class="mr-2 cursor-pointer flex items-end"
        >
          <img :src="duplicateIcon" alt="" />
        </span>
        <span
          @click="
            questionDeleteID = question.ID;
            questionDeleteIndex = index as number;
            updateDeleteQuestionModalStatus(true, 'mainQuestion');
          "
          class="mr-2 cursor-pointer flex items-end"
        >
          <img :src="removeIcon" alt="" />
        </span>
      </div>
    </div>
    <!-- Detail  -->
    <div
      v-show="showDetail || showAll"
      class="p-4 pt-8 text-gray-600 text-sm relative"
    >
      <span class="absolute right-2 cursor-pointer top-1"
        ><img
          @click="
            showDetail = false;
            isEdit = false;
          "
          class="w-8 h-8"
          :src="iconTop"
          alt=""
      /></span>
      <span class="font-bold text-base" v-html="question.Title"></span>
      <div v-if="!isEdit" v-html="question.Description"></div>
      <CKEditorCustom
        v-if="isEdit && question.Description"
        :model-value="question.Description"
        @update:model-value="(newValue:any) => (question.Description = newValue)"
      />
      <div
        v-for="questionDetail in question.Questions"
        :key="questionDetail.ID"
      >
        <div class="my-2 font-bold" v-html="questionDetail.Content"></div>
        <div class="flex flex-col">
          <span
            v-for="(answer, index) in questionDetail.Answers"
            :key="answer.ID"
            class="mb-2.5"
            :class="!isEdit ? 'flex' : ''"
          >
            <span
              v-if="question.Type != 'QUIZ2'"
              :class="answer.IsCorrect ? 'text-green font-bold' : ''"
              >{{ index + 1 }}.</span
            >
            <span
              :class="answer.IsCorrect ? 'text-green font-bold' : ''"
              v-if="!isEdit && question.Type != 'QUIZ2'"
              v-html="answer.Content"
            ></span>
            <CKEditorCustom
              v-if="isEdit"
              :model-value="answer.Content"
              @update:model-value="(newValue:any) => (answer.Content = newValue)"
            />
          </span>
        </div>
      </div>
      <!-- Bottom  -->
      <div class="flex justify-end mt-2">
        <div v-if="!isEdit" class="flex">
          <span
            v-if="canEdit"
            @click="isEdit = true"
            class="mr-2 cursor-pointer"
          >
            <img :src="editIcon" alt="" />
          </span>
          <span
            @click="
              questionDuplicateID = question.ID;
              questionDuplicateIndex = index as number;
              updateDuplicateQuestionModalStatus(true, 'mainQuestion');
            "
            class="mr-2 cursor-pointer"
          >
            <img :src="duplicateIcon" alt="" />
          </span>
          <span
            @click="
              questionDeleteID = question.ID;
              questionDeleteIndex = index as number;
              updateDeleteQuestionModalStatus(true, 'mainQuestion');
            "
            class="mr-2 cursor-pointer"
          >
            <img :src="removeIcon" alt="" />
          </span>
        </div>
        <div v-else>
          <button
            @click="
              resetData();
              isEdit = false;
            "
            class="button bg-white text-red-500 border border-gray-300 mr-3 w-15"
          >
            Huỷ
          </button>
          <button
            @click="
              updateQuestion(question);
              isEdit = false;
            "
            class="button button-primary"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { usePopupStore } from "../../stores/popup";
import { useQuestionBankStore } from "../../stores/question-bank-store";
import editIcon from "../../assets/image/edit.svg";
import eyeIcon from "../../assets/image/eye.svg";
import duplicateIcon from "../../assets/image/duplicateIcon.svg";
import removeIcon from "../../assets/image/removeIcon.svg";
import iconTop from "../../assets/image/top-arrow.svg";
import { storeToRefs } from "pinia";
import PartQuestion from "../../type/partQuestion";
import CKEditorCustom from "../custom/CKEditorCustom.vue";
import { addStaticLink } from "../../uses/addStaticLink";
import { changeMathJaxDes } from "../../uses/convertData";
import Answer from "../../type/answer";

export default defineComponent({
  name: "QuestionVue",
  components: {
    CKEditorCustom,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    questionPart: {
      type: Object,
      required: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
    answerListQuiz2: {
      type: Array,
      required: true,
    },
    showAll: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const {
      updateAddNewBankModalStatus,
      updateDeleteQuestionModalStatus,
      updateDuplicateQuestionModalStatus,
    } = usePopupStore();
    const { deleteQuestion } = useQuestionBankStore();
    // Remove the initialization of question with props.questionPart
    const question = ref<PartQuestion>();
    const defaultQuestion = ref<PartQuestion>();
    const {
      questionDeleteID,
      questionDeleteIndex,
      questionDuplicateID,
      questionDuplicateIndex,
      arrayUpdate,
      arrayAddnew,
    } = storeToRefs(useQuestionBankStore());
    const { updateQuestionInQuestionList } = useQuestionBankStore();

    const resetData = () => {
      // Reset the question ref to a deep copy of props.questionPart
      question.value = defaultQuestion.value;
      if (question.value) {
        updateQuestionInQuestionList(question.value);
      }
    };
    const updateQuestion = (question: PartQuestion) => {
      updateQuestionInQuestionList(question);
      if (question) {
        updateQuestionInQuestionList(question);
        const questionInAddlist = arrayAddnew.value.find(
          (data) => data.ID == question.ID
        );
        if (questionInAddlist) {
          const partIndex = arrayAddnew.value.findIndex(
            (data) => data.ID == questionInAddlist.ID
          );
          arrayAddnew.value[partIndex] = questionInAddlist;
        } else {
          arrayUpdate.value = [...arrayUpdate.value, question];
        }
      }
    };
    onMounted(() => {
      // Set the question ref to a deep copy of props.questionPart
      question.value = JSON.parse(JSON.stringify(props.questionPart));
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
      defaultQuestion.value = question.value;
    });
    onMounted(() => {
      nextTick(() => {
        if (question.value && question.value.Type == "QUIZ2") {
          setDefaultProperty();
        }
      });
    });
    const setDefaultProperty = () => {
      const elements = document.getElementsByClassName("fillquiz");
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLInputElement;
        const answers = props.answerListQuiz2 as Answer[];
        element.placeholder = answers[i]?.Content;
      }
    };
    const showDetail = ref(false);
    const isEdit = ref(false);
    return {
      editIcon,
      duplicateIcon,
      removeIcon,
      showDetail,
      eyeIcon,
      isEdit,
      iconTop,
      questionDeleteIndex,
      questionDeleteID,
      questionDuplicateID,
      questionDuplicateIndex,
      question,
      updateAddNewBankModalStatus,
      updateDeleteQuestionModalStatus,
      deleteQuestion,
      updateQuestionInQuestionList,
      updateDuplicateQuestionModalStatus,
      resetData,
      updateQuestion,
    };
  },
});
</script>
<style>
.question-detail p {
  margin: 0;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
