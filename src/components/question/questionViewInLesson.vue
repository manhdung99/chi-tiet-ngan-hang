<template>
  <!-- Default  -->
  <div v-if="partQuestionDetail" class="flex items-center ml-4 mt-4">
    <span
      v-html="partQuestionDetail.Title"
      class="text-sm font-medium text-red-500 mr-5 w-1/3"
    >
    </span>
    <input
      v-if="!isFillDesOnetime"
      v-model="partQuestionDetail.Description"
      class="input mr-2 w-1/4"
      type="text"
      placeholder="Nội dung"
    />
    <select
      v-model="partQuestionDetail.TypePart"
      class="input mr-2"
      name=""
      id=""
    >
      <option :value="1">Lý thuyết</option>
      <option :value="2">Bài tập</option>
    </select>
    <select
      v-model="partQuestionDetail.LevelPart"
      class="input mr-4"
      name=""
      id=""
    >
      <option :value="1">Nhận biết</option>
      <option :value="2">Thông hiểu</option>
      <option :value="3">Vận dụng</option>
    </select>
    <input
      @click="updateListSelectedQuestion"
      class="w-4 h-4 cursor-pointer"
      type="checkbox"
      :checked="currentSelectedQuestionsID.includes(partQuestionDetail.ID)"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { usePopupStore } from "../../stores/popup";
import { useSelectQuestionStore } from "../../stores/question-select-flow-store";
import editIcon from "../../assets/image/edit.svg";
import eyeIcon from "../../assets/image/eye.svg";
import duplicateIcon from "../../assets/image/duplicateIcon.svg";
import removeIcon from "../../assets/image/removeIcon.svg";
import iconTop from "../../assets/image/top-arrow.svg";
import { storeToRefs } from "pinia";
import PartQuestion from "../../type/partQuestion";
export default defineComponent({
  name: "QuestionViewInLesson",
  props: {
    question: {
      type: Object as () => PartQuestion,
      required: true,
    },
  },
  setup(props) {
    const { updateAddNewBankModalStatus } = usePopupStore();
    const { descriptionOneTime, isFillDesOnetime } = storeToRefs(
      useSelectQuestionStore()
    );
    // Remove the initialization of question with props.questionPart
    const partQuestionDetail = ref<PartQuestion>({
      ID: "",
      Description: "",
      Media: null,
      Title: "",
      Type: "",
      TypePart: 1,
      LevelPart: 1,
      Questions: [],
    });
    const { currentSelectedQuestion } = storeToRefs(useSelectQuestionStore());
    const showDetail = ref(false);
    const isEdit = ref(false);
    const currentSelectedQuestionsID = ref<Array<string>>([]);
    const updateListSelectedQuestion = () => {
      if (isFillDesOnetime) {
        partQuestionDetail.value.Description = descriptionOneTime.value;
      }
      if (
        currentSelectedQuestion.value.length > 0 &&
        partQuestionDetail.value != null
      ) {
        if (
          currentSelectedQuestionsID.value.includes(partQuestionDetail.value.ID)
        ) {
          currentSelectedQuestion.value = currentSelectedQuestion.value.filter(
            (question) => question.ID != partQuestionDetail.value.ID
          );
        } else {
          currentSelectedQuestion.value = [
            partQuestionDetail.value,
            ...currentSelectedQuestion.value,
          ];
        }
      } else {
        currentSelectedQuestion.value = [
          partQuestionDetail.value,
          ...currentSelectedQuestion.value,
        ];
      }
      currentSelectedQuestionsID.value = currentSelectedQuestion.value.map(
        (question) => question.ID
      );
    };
    onMounted(() => {
      partQuestionDetail.value = {
        ...props.question,
        TypePart: 1,
        LevelPart: 1,
      };
      currentSelectedQuestionsID.value = currentSelectedQuestion.value.map(
        (question) => question.ID
      );
    });
    return {
      editIcon,
      duplicateIcon,
      removeIcon,
      showDetail,
      eyeIcon,
      isEdit,
      iconTop,
      partQuestionDetail,
      currentSelectedQuestion,
      descriptionOneTime,
      isFillDesOnetime,
      currentSelectedQuestionsID,
      updateAddNewBankModalStatus,
      updateListSelectedQuestion,
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
.card {
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
