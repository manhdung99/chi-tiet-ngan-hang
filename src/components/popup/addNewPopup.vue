<template>
  <div class="modal center">
    <div class="bg-white rounded-sm p-4 add-new-popup">
      <div class="flex items-center justify-between font-semibold text-xl">
        Thêm câu hỏi
        <span @click="updateAddNewBankModalStatus(false)" class="cursor-pointer"
          ><img :src="closeIcon" alt=""
        /></span>
      </div>
      <div class="flex flex-wrap marker:justify-between mt-4">
        <div
          @click="
            updateSelectQuestionFromCourseStatus(true);
            updateAddNewBankModalStatus(false);
          "
          class="card"
        >
          <div class="font-semibold">Chọn từ học liệu</div>
          <div class="text-sm">Chọn từ thư viện sách của Eduso</div>
        </div>

        <div
          @click="
            updateSelectQuestionFromBankStatus(true);
            updateAddNewBankModalStatus(false);
          "
          class="card"
        >
          <div class="font-semibold">Chọn từ ngân hàng khác</div>
          <div class="text-sm">Chọn từ thư viện sách của Eduso</div>
        </div>
        <div class="card">
          <div class="font-semibold">Tạo từ file Word</div>
          <div class="text-sm">Chọn từ thư viện sách của Eduso</div>
        </div>
        <div
          @click="
            updateAddNewQuestionHandmadeModalStatus(true);
            updateAddNewBankModalStatus(false);
          "
          class="card"
        >
          <div class="font-semibold">Tạo thủ công</div>
          <div class="text-sm">Chọn từ thư viện sách của Eduso</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import closeIcon from "../../assets/image/close-icon.svg";
import { usePopupStore } from "../../stores/popup";
export default defineComponent({
  name: "AddNewPopup",
  setup() {
    const {
      updateAddNewBankModalStatus,
      updateAddNewQuestionHandmadeModalStatus,
      updateSelectQuestionFromCourseStatus,
      updateSelectQuestionFromBankStatus,
    } = usePopupStore();
    return {
      closeIcon,
      updateAddNewBankModalStatus,
      updateAddNewQuestionHandmadeModalStatus,
      updateSelectQuestionFromCourseStatus,
      updateSelectQuestionFromBankStatus,
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
