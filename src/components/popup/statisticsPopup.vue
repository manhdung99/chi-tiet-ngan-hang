<template>
  <div class="modal center">
    <div class="bg-white rounded-sm p-4 statistics-popup">
      <div class="flex items-center justify-between font-semibold text-xl">
        Thống kê ngân hàng đề
        <span
          @click="updateStatisticsBankModalStatus(false)"
          class="cursor-pointer"
          ><img :src="closeIcon" alt=""
        /></span>
      </div>
      <div class="mt-4">
        <p class="text-sm font-bold">Phân loại câu</p>
        <table class="classify-table">
          <thead>
            <tr>
              <th><div>Tổng câu</div></th>
              <th><div>Số câu bài tập</div></th>
              <th><div>Số câu lý thuyết</div></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ currentBankQuestions.length }}</td>
              <td>{{ theoryQuestions.length }}</td>
              <td>
                {{ currentBankQuestions.length - theoryQuestions.length }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4">
        <p class="text-sm font-bold">Mức độ</p>
        <table class="level-table">
          <thead>
            <tr>
              <th><div>Nhận biết</div></th>
              <th><div>Thông hiểu</div></th>
              <th><div>Vận dụng</div></th>
              <th><div>Vạn dụng cao</div></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ basicQuestions.length }}</td>
              <td>{{ normalQuestions.length }}</td>
              <td>{{ advanceQuestions.length }}</td>
              <td>
                {{
                  currentBankQuestions.length -
                  basicQuestions.length -
                  normalQuestions.length -
                  advanceQuestions.length
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4">
        <p class="text-sm font-bold">Loại câu hỏi</p>
        <table class="level-table">
          <thead>
            <tr>
              <th><div>Chọn 1 đáp án</div></th>
              <th><div>Nối từ</div></th>
              <th><div>Điền từ</div></th>
              <th><div>Chọn nhiều đáp án</div></th>
              <th><div>Tự luận</div></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ countQuiz1.length }}</td>
              <td>{{ countQuiz2.length }}</td>
              <td>{{ countQuiz3.length }}</td>
              <td>{{ countQuiz4.length }}</td>
              <td>{{ countEssay.length }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import closeIcon from "../../assets/image/close-icon.svg";
import { usePopupStore } from "../../stores/popup";
import { useQuestionBankStore } from "../../stores/question-bank-store";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "StatisticsPopup",
  setup() {
    const { updateStatisticsBankModalStatus } = usePopupStore();
    const { currentBankQuestions } = storeToRefs(useQuestionBankStore());
    const theoryQuestions = computed(() => {
      return currentBankQuestions.value.filter(
        (question) => question.TypePart == 2
      );
    });
    const basicQuestions = computed(() => {
      return currentBankQuestions.value.filter(
        (question) => question.LevelPart == 1
      );
    });
    const normalQuestions = computed(() => {
      return currentBankQuestions.value.filter(
        (question) => question.LevelPart == 2
      );
    });
    const advanceQuestions = computed(() => {
      return currentBankQuestions.value.filter(
        (question) => question.LevelPart == 3
      );
    });
    const countQuiz1 = computed(() => {
      return currentBankQuestions.value.filter(
        (question) => question.Type == "QUIZ1"
      );
    });
    const countQuiz2 = computed(() => {
      return currentBankQuestions.value.filter(
        (question) => question.Type == "QUIZ2"
      );
    });
    const countQuiz3 = computed(() => {
      return currentBankQuestions.value.filter(
        (question) => question.Type == "QUIZ3"
      );
    });
    const countQuiz4 = computed(() => {
      return currentBankQuestions.value.filter(
        (question) => question.Type == "QUIZ4"
      );
    });
    const countEssay = computed(() => {
      return currentBankQuestions.value.filter(
        (question) => question.Type == "ESSAY"
      );
    });
    return {
      closeIcon,
      updateStatisticsBankModalStatus,
      currentBankQuestions,
      theoryQuestions,
      basicQuestions,
      normalQuestions,
      advanceQuestions,
      countQuiz1,
      countQuiz2,
      countQuiz3,
      countQuiz4,
      countEssay,
    };
  },
});
</script>
<style>
.statistics-popup table {
  border: 1px solid rgb(0, 0, 0, 0.06);
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}
.statistics-popup table tr {
  border-bottom: 1px solid rgb(0, 0, 0, 0.06);
  padding: 1rem 0;
  font-size: 14px;
}
.statistics-popup table th {
  background-color: rgb(0, 0, 0, 0.02);
  height: 54px;
  min-width: 8.5rem;
}
.statistics-popup table th div {
  padding: 0 16px;
  border-right: 1px solid rgb(0, 0, 0, 0.06);
}
.statistics-popup table td {
  height: 54px;
  padding: 0 16px;
  min-width: 8.5rem;
}
</style>
