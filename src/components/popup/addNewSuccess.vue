<template>
  <div class="custom-modal modal-center z-10">
    <div class="bg-white rounded-md select-question-from-bank relative p-4">
      <div>
        <div class="flex justify-center">
          <img class="w-32 h-32" :src="successIcon" alt="" />
        </div>
      </div>
      <h2 class="swal2-title" id="swal2-title">Lưu ngân hàng thành công</h2>

      <div class="swal2-actions">
        <button
          @click="moveToListBank()"
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
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import closeIcon from "../../assets/image/close-icon.svg";
import { usePopupStore } from "../../stores/popup";
import successIcon from "../../assets/image/success-icon.svg";
import { useQuestionBankStore } from "../../stores/question-bank-store";
export default defineComponent({
  name: "AddNewSuccess",
  props: {
    subjectID: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { updateAddNewSuccessStatus } = usePopupStore();
    const { deleteBank, duplicateBank } = useQuestionBankStore();
    const moveToListBank = () => {
      updateAddNewSuccessStatus(false);
    };
    return {
      closeIcon,
      successIcon,
      duplicateBank,
      deleteBank,
      moveToListBank,
    };
  },
});
</script>
