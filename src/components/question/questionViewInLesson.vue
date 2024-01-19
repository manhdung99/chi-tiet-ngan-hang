<template>
  <!-- Default  -->
  <div v-if="partQuestionDetail" class="flex items-center ml-4 mt-4">
    <span
      v-html="partQuestionDetail.Title"
      class="text-sm font-medium text-red-500 mr-5 w-1/3"
    >
    </span>
    <input
      :disabled="isFillDesOnetime"
      v-model="partQuestionDetail.TagsName"
      class="input mr-2 w-1/4 h-10"
      type="text"
      placeholder="Nội dung"
      @change="updateQuestionInSelected"
    />
    <select
      v-model="partQuestionDetail.TypePart"
      class="input mr-2 h-10"
      name=""
      id=""
      @change="updateQuestionInSelected"
    >
      <option :value="1">Lý thuyết</option>
      <option :value="2">Bài tập</option>
    </select>
    <select
      v-model="partQuestionDetail.LevelPart"
      class="input mr-4 h-10"
      name=""
      id=""
      @change="updateQuestionInSelected"
    >
      <option :value="1">Nhận biết</option>
      <option :value="2">Thông hiểu</option>
      <option :value="3">Vận dụng</option>
      <option :value="4">Vận dụng cao</option>
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
import { defineComponent, onMounted, ref, watch } from "vue";
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
    const { tagsNameOneTime, isFillDesOnetime } = storeToRefs(
      useSelectQuestionStore()
    );
    // Remove the initialization of question with props.questionPart
    const partQuestionDetail = ref<PartQuestion>({
      ID: "",
      Description: "",
      Media: null,
      Title: "",
      Type: "",
      TypePart: 2,
      LevelPart: 1,
      Questions: [],
      TagsName: "",
    });
    const { currentSelectedQuestion } = storeToRefs(useSelectQuestionStore());
    const showDetail = ref(false);
    const isEdit = ref(false);
    const currentSelectedQuestionsID = ref<Array<string>>([]);
    const updateListSelectedQuestion = () => {
      if (isFillDesOnetime.value) {
        partQuestionDetail.value.TagsName = tagsNameOneTime.value;
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
    const updateQuestionInSelected = () => {
      if (
        currentSelectedQuestionsID.value.includes(partQuestionDetail.value.ID)
      ) {
        const index = currentSelectedQuestion.value.findIndex((question) => {
          return question.ID == partQuestionDetail.value.ID;
        });
        let newArray = [...currentSelectedQuestion.value];
        if (index >= 0) {
          newArray[index] = partQuestionDetail.value;
          currentSelectedQuestion.value = [...newArray];
        }
      }
    };
    watch([tagsNameOneTime, isFillDesOnetime], () => {
      if (isFillDesOnetime) {
        partQuestionDetail.value.TagsName = tagsNameOneTime.value;
      }
    });
    onMounted(() => {
      partQuestionDetail.value = {
        ...props.question,
        TypePart: 2,
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
      tagsNameOneTime,
      isFillDesOnetime,
      currentSelectedQuestionsID,
      updateAddNewBankModalStatus,
      updateListSelectedQuestion,
      updateQuestionInSelected,
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
