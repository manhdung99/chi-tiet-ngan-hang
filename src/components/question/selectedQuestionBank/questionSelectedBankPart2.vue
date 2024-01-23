<template>
  <!-- Default  -->
  <div v-if="question" class="bg-white rounded-md question-detail mb-4">
    <div
      class="p-3 flex items-center justify-between border-b border-grey-lighter"
    >
      <span class="text-sm font-semibold"
        ><span>
          Câu hỏi số {{ index + 1 }}
          <span v-if="question.TagsName"> : {{ question.TagsName }}</span></span
        ></span
      >
      <span class="text-sm text-black-lighter"
        >{{ question.TypePart == 1 ? "Lý thuyết" : "Bài tập" }} |
        {{
          question.LevelPart == 1
            ? "Nhận biết"
            : question.LevelPart == 2
            ? "Thông hiểu"
            : question.LevelPart == 3
            ? "Vận dụng"
            : question.LevelPart == 4
            ? "Vận dụng cao"
            : "Khác"
        }}
        |
        {{
          question.Type == "QUIZ1"
            ? "Chọn một"
            : question.Type == "QUIZ2"
            ? "Điền từ"
            : question.Type == "QUIZ3"
            ? "Matching"
            : "Chọn nhiều"
        }}</span
      >
    </div>
    <!-- Default  -->
    <div
      v-show="!showDetail"
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
          title="Xem chi tiết "
          @click="showDetail = true"
          class="mr-2 cursor-pointer flex items-end"
        >
          <img :src="eyeIcon" alt="" />
        </span>
        <span
          @click="removeQuestionInListSelected(question.ID)"
          class="mr-2 cursor-pointer"
        >
          <img :src="removeIcon" alt="" />
        </span>
      </div>
    </div>
    <!-- Detail  -->
    <div v-show="showDetail" class="p-4 pt-8 text-gray-600 text-sm relative">
      <div class="pr-32">
        <span
          v-if="question.Title != null && !question.Title.includes('null')"
          class="font-bold text-base"
          v-html="question.Title"
        ></span>
        <div
          v-if="
            question.Description != null &&
            !question.Description.includes('null')
          "
          v-html="question.Description"
        ></div>
        <div
          v-for="questionDetail in question.Questions"
          :key="questionDetail.ID"
        >
          <div
            class="my-2 font-bold flex"
            v-html="questionDetail.Content"
          ></div>
          <div class="flex flex-col">
            <span
              v-for="(answer, index) in questionDetail.Answers"
              :key="answer.ID"
              class="mb-2.5"
              :class="answer.IsCorrect ? 'text-green font-bold' : ''"
            >
              <span
                v-if="
                  !answer.Content.includes('A') &&
                  !answer.Content.includes('B') &&
                  !answer.Content.includes('C') &&
                  !answer.Content.includes('D')
                "
              >
                {{
                  index == 0
                    ? "A"
                    : index == 1
                    ? "B"
                    : index == 2
                    ? "C"
                    : index == 3
                    ? "D"
                    : "E"
                }}
              </span>
              <span
                v-if="
                  !answer.Content.includes('A') &&
                  !answer.Content.includes('B') &&
                  !answer.Content.includes('C') &&
                  !answer.Content.includes('D')
                "
                class="mx-1"
              >
                .
              </span>
              <span v-html="answer.Content"></span>
            </span>
          </div>
        </div>
      </div>
      <!-- Bottom  -->
      <div class="flex justify-end mt-2 absolute top-2 right-1">
        <div class="flex">
          <span
            title="Thu gọn "
            @click="showDetail = false"
            class="icon-hide mr-2 cursor-pointer"
          >
            <EyeInvisibleOutlined />
          </span>
          <span
            title="Xóa câu hỏi "
            @click="removeQuestionInListSelected(question.ID)"
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
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { usePopupStore } from "../../../stores/popup";
import { useQuestionBankStore } from "../../../stores/question-bank-store";
import editIcon from "../../../assets/image/edit.svg";
import eyeIcon from "../../../assets/image/eye.svg";
import duplicateIcon from "../../../assets/image/duplicateIcon.svg";
import removeIcon from "../../../assets/image/removeIcon.svg";
import iconTop from "../../../assets/image/top-arrow.svg";
import { storeToRefs } from "pinia";
import PartQuestion from "../../../type/partQuestion";
import Answer from "../../../type/answer";
import { EyeInvisibleOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "questionSelectedBankPart2",
  components: {
    EyeInvisibleOutlined,
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
    answerListQuiz2: {
      type: Array,
      required: true,
    },
    removeQuestionInListSelected: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const { updateAddNewBankModalStatus, updateDeleteQuestionModalStatus } =
      usePopupStore();
    const { deleteQuestion } = useQuestionBankStore();

    // Remove the initialization of question with props.questionPart
    const question = ref<PartQuestion>();

    const { questionDeleteID, questionDeleteIndex } = storeToRefs(
      useQuestionBankStore()
    );
    const { updateQuestionInQuestionList } = useQuestionBankStore();

    const resetData = () => {
      // Reset the question ref to a deep copy of props.questionPart
      question.value = JSON.parse(JSON.stringify(props.questionPart));
    };

    onMounted(() => {
      // Set the question ref to a deep copy of props.questionPart
      question.value = JSON.parse(JSON.stringify(props.questionPart));
    });
    onMounted(() => {
      nextTick(() => {
        if (question.value && question.value.Type == "QUIZ2") {
          setDefaultProperty();
        }
      });
    });
    const setDefaultProperty = () => {
      const elements = document.querySelectorAll(
        ".select-bank-custom-modal-content .fillquiz"
      );
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLInputElement;
        const answers = props.answerListQuiz2 as Answer[];
        element.placeholder = answers[i].Content;
      }
    };
    const showDetail = ref(false);

    return {
      editIcon,
      duplicateIcon,
      removeIcon,
      showDetail,
      eyeIcon,
      iconTop,
      questionDeleteIndex,
      questionDeleteID,
      question,
      updateAddNewBankModalStatus,
      updateDeleteQuestionModalStatus,
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
.card-add-new {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 16px 20px;
  min-width: 300px;
  margin-bottom: 16px;
  margin-right: 16px;
  cursor: pointer;
}
.question-detail p {
  margin: 0;
}
</style>
