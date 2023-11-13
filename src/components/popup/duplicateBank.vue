<template>
  <div class="modal center z-10">
    <div
      class="w-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-lg z-10"
    >
      <h2 class="mb-4">
        Bạn muốn nhân bản
        <span class="text-red font-bold">ngân hàng {{ bank.Name }} </span>?
      </h2>
      <div class="flex justify-end">
        <button
          @click="
            duplicateBank(bank);
            updateDuplicateBankModalStatus(false);
          "
          class="bg-red-500 text-white py-2 px-4 rounded mr-4 hover:opacity-90"
        >
          Nhân bản
        </button>
        <button
          @click="updateDuplicateBankModalStatus(false)"
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
export default defineComponent({
  name: "duplicateBankPopup",
  props: {
    bank: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { updateDuplicateBankModalStatus } = usePopupStore();
    const { duplicateBank } = useQuestionBankStore();
    return {
      closeIcon,
      updateDuplicateBankModalStatus,
      duplicateBank,
    };
  },
});
</script>
