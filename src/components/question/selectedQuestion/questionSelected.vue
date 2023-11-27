<template>
  <!-- Default  -->
  <div v-if="question" class="bg-white rounded-md question-detail mb-4">
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
      v-if="!showDetail"
      class="p-4 text-sm text-gray-600 flex justify-between"
    >
      <span class="max-w-4/5" v-if="question.Title || question.Description">
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
    <div v-else class="p-4 pt-8 text-gray-600 text-sm relative">
      <span class="absolute right-2 cursor-pointer top-1"
        ><img @click="showDetail = false" class="w-8 h-8" :src="iconTop" alt=""
      /></span>
      <span class="font-bold text-base" v-html="question.Title"></span>
      <div v-html="question.Description"></div>
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
          >
            <span :class="answer.IsCorrect ? 'text-green font-bold' : ''"
              >{{ index + 1 }}.</span
            >
            <span
              :class="answer.IsCorrect ? 'text-green font-bold' : ''"
              v-html="answer.Content"
            ></span>
          </span>
        </div>
      </div>
      <!-- Bottom  -->
      <div class="flex justify-end mt-2">
        <div class="flex">
          <span
            @click="
              questionDuplicateID = question.ID;
              questionDuplicateIndex = index as number;
              updateDuplicateQuestionModalStatus(true, 'selectedQuestion');
            "
            class="mr-2 cursor-pointer"
          >
            <img :src="duplicateIcon" alt="" />
          </span>
          <span
            @click="
              questionDeleteID = question.ID;
              questionDeleteIndex = index as number;
              updateDeleteQuestionModalStatus(true, 'selectedQuestion');
            "
            class="mr-2 cursor-pointer"
          >
            <img :src="removeIcon" alt="" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { usePopupStore } from "../../../stores/popup";
import { useQuestionBankStore } from "../../../stores/question-bank-store";
import editIcon from "../../../assets/image/edit.svg";
import eyeIcon from "../../../assets/image/eye.svg";
import duplicateIcon from "../../../assets/image/duplicateIcon.svg";
import removeIcon from "../../../assets/image/removeIcon.svg";
import iconTop from "../../../assets/image/top-arrow.svg";
import { storeToRefs } from "pinia";
import PartQuestion from "../../../type/partQuestion";
export default defineComponent({
  name: "QuestionSelectedVue",
  props: {
    index: {
      type: Number,
      required: true,
    },
    questionPart: {
      type: Object,
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

    const {
      questionDeleteID,
      questionDuplicateID,
      questionDuplicateIndex,
      questionDeleteIndex,
    } = storeToRefs(useQuestionBankStore());
    const { updateQuestionInQuestionList } = useQuestionBankStore();

    const resetData = () => {
      // Reset the question ref to a deep copy of props.questionPart
      question.value = JSON.parse(JSON.stringify(props.questionPart));
    };

    onMounted(() => {
      // Set the question ref to a deep copy of props.questionPart
      question.value = JSON.parse(JSON.stringify(props.questionPart));
    });

    const showDetail = ref(false);

    return {
      editIcon,
      duplicateIcon,
      removeIcon,
      showDetail,
      eyeIcon,
      iconTop,
      questionDuplicateID,
      questionDuplicateIndex,
      questionDeleteIndex,
      questionDeleteID,
      question,
      updateAddNewBankModalStatus,
      updateDeleteQuestionModalStatus,
      updateDuplicateQuestionModalStatus,
      deleteQuestion,
      updateQuestionInQuestionList,
      resetData,
    };
  },
});
</script>
<style>
.add-new-popup {
  max-width: 1000px;
  background: white;
  border-radius: 4px;
  padding: 16px;
}
.question-detail p {
  margin: 0;
}
</style>
