<template>
  <div class="modal center z-10">
    <div
      class="w-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-lg z-10"
    >
      <h2 class="mb-4">
        Bạn có chắc chắn muốn xoá
        <span class="text-red font-bold"
          >câu hỏi số {{ questionDeleteIndex + 1 }} </span
        >?
      </h2>
      <div class="flex justify-end">
        <button
          @click="
            handleDetele(questionDeleteID);
            updateDeleteQuestionModalStatus(false);
          "
          class="bg-red-500 text-white py-2 px-4 rounded mr-4 hover:opacity-90"
        >
          Xoá
        </button>
        <button
          @click="updateDeleteQuestionModalStatus(false)"
          class="bg-blue-500 text-white py-2 px-4 rounded hover:opacity-90"
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import closeIcon from "../../assets/image/close-icon.svg";
import { usePopupStore } from "../../stores/popup";
import { useQuestionBankStore } from "../../stores/question-bank-store";
import { storeToRefs } from "pinia";
import { useSelectQuestionStore } from "../../stores/question-select-flow-store";
export default defineComponent({
  name: "DeleteQuestionPopup",
  setup() {
    const { updateDeleteQuestionModalStatus } = usePopupStore();
    const { deleteKey } = storeToRefs(usePopupStore());
    const { deleteQuestion } = useQuestionBankStore();
    const { deleteSelectedQuestion } = useSelectQuestionStore();
    const { questionDeleteID, questionDeleteIndex } = storeToRefs(
      useQuestionBankStore()
    );
    const handleDetele = (id: string) => {
      if (deleteKey.value == "selectedQuestion") {
        deleteSelectedQuestion(id);
      } else if (deleteKey.value == "mainQuestion") {
        deleteQuestion(id);
      }
    };
    return {
      closeIcon,
      updateDeleteQuestionModalStatus,
      deleteSelectedQuestion,
      deleteQuestion,
      handleDetele,
      questionDeleteID,
      questionDeleteIndex,
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
</style>
