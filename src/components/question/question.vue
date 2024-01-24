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
        >Câu hỏi số {{ question.dataIndex + 1 }}
        <span v-if="question.TagsName"> : {{ question.TagsName }}</span></span
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
            : question.Type == "QUIZ4"
            ? "Chọn nhiều"
            : "Tự luận"
        }}</span
      >
    </div>
    <!-- Default  -->
    <div
      v-if="!showDetail && !showAll"
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
          title="Hiển thị chi tiết"
          @click="showDetail = true"
          class="mr-2 cursor-pointer flex items-end"
        >
          <img :src="eyeIcon" alt="" />
        </span>
        <span
          title="Nhân bản câu "
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
          title="Xóa câu hỏi "
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
      <div class="pr-32">
        <span
          class="font-bold text-base"
          v-if="question.Title != null && !question.Title.includes('null')"
          v-html="question.Title"
        ></span>
        <div v-if="question.Media != null && question.Media != 'null'">
          <audio :src="question.Media.Path" :controls="true"></audio>
        </div>
        <div
          v-if="
            question.Description != null &&
            !question.Description.includes('null')
          "
          ref="quiz2Description"
          v-html="question.Description"
        ></div>
        <div
          v-for="questionDetail in question.Questions"
          :key="questionDetail.ID"
        >
          <div v-if="question.Type != 'QUIZ2'">
            <div
              class="my-2 font-bold flex"
              v-html="questionDetail.Content"
            ></div>
            <div class="flex flex-col">
              <span
                v-for="(answer, index) in questionDetail.Answers"
                :key="answer.ID"
                class="mb-2.5 flex"
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
            title="Chỉnh sửa câu hỏi "
            v-if="canEdit"
            @click="isEdit = true"
            class="mr-2 cursor-pointer"
          >
            <img :src="editIcon" alt="" />
          </span>
          <span
            title="Nhân bản câu hỏi "
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
            title="Xóa câu hỏi "
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
      </div>
    </div>
  </div>
  <Teleport v-if="question && isEdit" to="body">
    <editQuestionHandmade
      :questionPart="questionPart"
      :closeEditModal="closeEditModal"
      :quiz2Description="quiz2Description"
    />
  </Teleport>
</template>
<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from "vue";
import { usePopupStore } from "../../stores/popup";
import { useQuestionBankStore } from "../../stores/question-bank-store";
import editIcon from "../../assets/image/edit.svg";
import eyeIcon from "../../assets/image/eye.svg";
import duplicateIcon from "../../assets/image/duplicateIcon.svg";
import removeIcon from "../../assets/image/removeIcon.svg";
import iconTop from "../../assets/image/top-arrow.svg";
import { storeToRefs } from "pinia";
import PartQuestion from "../../type/partQuestion";
import { addStaticLink } from "../../uses/addStaticLink";
import { changeMathJaxDes } from "../../uses/convertData";
import editQuestionHandmade from "../popup/editQuestionHandmade.vue";
import Answer from "../../type/answer";
import { convertStringNullToNull } from "../../uses/function";
import { EyeInvisibleOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "QuestionVue",
  components: {
    editQuestionHandmade,
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
    currentBankQuestionFilter: {
      type: Array,
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
    const quiz2Description = ref(null);
    const {
      questionDeleteID,
      questionDeleteIndex,
      questionDuplicateID,
      questionDuplicateIndex,
      arrayUpdate,
      arrayAddnew,
      currentBankQuestions,
    } = storeToRefs(useQuestionBankStore());
    const { updateQuestionInQuestionList } = useQuestionBankStore();
    const closeEditModal = () => {
      isEdit.value = false;
    };
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
    watch(currentBankQuestions, () => {
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
      nextTick(() => {
        if (question.value && question.value.Type == "QUIZ2") {
          setDefaultProperty();
        }
      });
    });
    onMounted(() => {
      // Set the question ref to a deep copy of props.questionPart
      question.value = JSON.parse(JSON.stringify(props.questionPart));
      if (question.value) {
        convertStringNullToNull(question.value);
      }
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
      let htmlDescription = "";
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLInputElement;
        if (!element.placeholder) {
          const answers = props.answerListQuiz2 as Answer[];
          element.placeholder = answers[i]?.Content;
          htmlDescription = htmlDescription + element;
        }
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
      quiz2Description,
      updateAddNewBankModalStatus,
      updateDeleteQuestionModalStatus,
      deleteQuestion,
      updateQuestionInQuestionList,
      updateDuplicateQuestionModalStatus,
      resetData,
      updateQuestion,
      closeEditModal,
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
.icon-hide {
  width: 24px;
  height: 24px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
