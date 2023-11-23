<template>
  <div class="question-bank-detail">
    <!-- Header page  -->
    <div class="page-header bg-white px-6 py-5">
      <span class="breadcrumb">Home/ Khảo thí / Tiếng Anh</span>
      <div class="flex justify-between items-center">
        <div class="font-semibold text-xl flex items-center">
          <span @click="getCurrentBankQuestions('')" class="cursor-pointer mr-4"
            ><img :src="leftIcon" alt=""
          /></span>
          Tạo ngân hàng câu hỏi
        </div>
        <div>
          <button class="button button-primary">Lưu</button>
        </div>
      </div>
    </div>
    <div class="page-body p-6 relative pb-0">
      <div class="flex justify-between">
        <!-- Question  -->
        <div class="flex-1 mr-9">
          <div class="flex justify-between">
            <div>
              <div class="text-sm font-bold">
                <span class="text-red-500">*</span> Tên ngân hàng câu hỏi
              </div>
              <input v-model="currentbankName" class="input" type="text" />
            </div>
            <div class="">
              <button
                @click="validatelistQuestion"
                class="button button-primary"
              >
                Kiểm tra lỗi
              </button>
            </div>
          </div>
          <!-- Chưa có câu hỏi  -->
          <!-- <div class="mt-4">Chọn "Thêm câu hỏi" để tạo ngân hàng câu hỏi</div> -->
          <!-- Có câu hỏi  -->
          <div class="list-question mt-4 scroll-area">
            <questionVue
              v-for="(question, index) in currentBankQuestionFilter"
              :key="question.ID"
              :questionPart="question"
              :index="index"
              :canEdit="true"
              :answerListQuiz2="answerListQuiz2"
              :showAll="showAll"
            />
          </div>
          <div
            class="text-red-500"
            v-if="currentBankQuestions.length == 0 && !isLoading"
          >
            Không có dữ liệu
          </div>
          <div
            v-if="currentBankQuestionFilter.length > 0"
            class="flex justify-center mt-4"
          >
            <a-pagination
              @show-size-change="handlePageSizeChange"
              v-model:current="currentPage"
              :defaultPageSize="pageSize"
              :total="
                pageLength > 0 ? pageLength : currentBankQuestionFilter.length
              "
              :pageSizeOptions="pageSizeOptions"
              show-less-items
            />
          </div>
        </div>
        <!-- Action   -->
        <div class="flex flex-col top-4">
          <button
            @click="updateAddNewBankModalStatus(true)"
            class="button button-primary mt-2"
          >
            Thêm câu hỏi
          </button>
          <button
            class="button bg-white text-red-500 border border-gray-300 mt-4"
          >
            Xoá ngân hàng
          </button>
          <span
            @click="openStatisticsBankModal = true"
            class="text-blue underline mt-4 cursor-pointer"
            >Xem thống kê</span
          >
          <!-- Tuỳ chọn  -->
          <div></div>
          <div class="mt-6">
            <p class="font-bold border-b border-black pb-2">Tuỳ chọn</p>
            <div class="flex items-center mt-2">
              <input
                v-model="showAll"
                class="w-4 h-4 cursor-pointer"
                type="checkbox"
              />
              <span class="text-sm ml-2">Hiển thị chi tiết câu hỏi</span>
            </div>
            <div class="flex items-center mt-2 font-semibold">
              <span class="text-sm">Trắc nghiệm & tự luận</span>
            </div>
            <div class="flex items-center mt-2 ml-4">
              <input
                @click="showOnlyEssay = false"
                v-model="showOnlyTheory"
                class="w-4 h-4 cursor-pointer"
                type="checkbox"
              />
              <span class="text-sm ml-2">Trắc nghiệm</span>
            </div>
            <div class="flex items-center mt-2 ml-4">
              <input
                @click="showOnlyTheory = false"
                v-model="showOnlyEssay"
                class="w-4 h-4 cursor-pointer"
                type="checkbox"
              />
              <span class="text-sm ml-2">Tự luận</span>
            </div>
          </div>

          <!-- Tên nội dung  -->
          <div v-if="currentBankQuestions.length > 0" class="mt-4">
            <p class="font-bold border-b border-black pb-2">Tên nội dung</p>
            <div
              @click="handleUpdateFilterQuestions(currentBankQuestions, '')"
              class="border-b py-2.5 cursor-pointer pl-1"
              :class="filterKey == '' ? 'bg-gray' : ''"
            >
              Tất cả ({{ currentBankQuestions.length }})
            </div>
            <div class="filter-list scroll" v-if="filterArray.length > 0">
              <div
                v-for="(levelQuestion, index) in filterArray"
                :key="levelQuestion.id"
              >
                <div
                  v-if="levelQuestion.levelQuestions?.length > 0"
                  class="border-b py-2.5 cursor-pointer pl-1"
                  :class="filterKey == levelQuestion.id ? 'bg-gray' : ''"
                  @click="
                    handleUpdateFilterQuestions(
                      levelQuestion.levelQuestions,
                      levelQuestion.id
                    )
                  "
                >
                  {{ index + 1 }}. {{ levelQuestion.name }} ({{
                    levelQuestion.levelQuestions.length
                  }})
                </div>

                <div
                  v-for="(type, dataIndex) in levelQuestion.typeQuestions"
                  :key="type.id"
                  :class="[
                    type.data.length > 0 ? '' : 'hidden',
                    filterKey == type.id ? 'bg-gray' : '',
                  ]"
                  class="border-b py-2.5 pl-4 cursor-pointer"
                  @click="handleUpdateFilterQuestions(type.data, type.id)"
                >
                  {{ index + 1 }}.{{ dataIndex + 1 }} {{ type.name }} ({{
                    type.data.length
                  }})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <AddNewPopup v-if="openAddNewBankModal" />
  </Teleport>
  <Teleport to="body">
    <deletePopup v-if="openDeleteQuestionModal" />
  </Teleport>
  <Teleport to="body">
    <duplicatePopup v-if="openDuplicateQuestionModal" />
  </Teleport>
  <Teleport to="body">
    <addNewQuestionHandmade v-if="openAddNewQuestionHandmadeModal" />
  </Teleport>
  <Teleport to="body">
    <selectQuestionFromCourse v-if="openSelectQuestionFromCourse" />
  </Teleport>
  <Teleport to="body">
    <SelectQuestionFromBank v-if="openSelectQuestionFromBank" />
  </Teleport>
  <Teleport to="body">
    <statisticsPopup v-if="openStatisticsBankModal" />
  </Teleport>
  <Teleport to="body">
    <div
      v-if="isLoading"
      class="fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center bg-custom-modal z-10"
    >
      <img :src="loadingIcon" alt="" />
    </div>
  </Teleport>
</template>

<script lang="ts">
declare global {
  interface Window {
    MathJax: any;
  }
}
import questionVue from "./components/question/question.vue";
import AddNewPopup from "./components/popup/addNewPopup.vue";
import deletePopup from "./components/popup/deleteQuestionPopup.vue";
import duplicatePopup from "./components/popup/duplicateQuestionPopup.vue";
import addNewQuestionHandmade from "@/components/popup/addNewQuestionHandmade.vue";
import selectQuestionFromCourse from "@/components/popup/selectQuestionFromCourse.vue";
import SelectQuestionFromBank from "@/components/popup/selectQuestionFromBank.vue";
import statisticsPopup from "@/components/popup/statisticsPopup.vue";
import loadingIcon from "./assets/image/loading-gif.gif";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import leftIcon from "./assets/image/ArrowLeft.svg";
import { useQuestionBankStore } from "./stores/question-bank-store";
import { usePopupStore } from "./stores/popup";
import { validateQuestion } from "./uses/function";
import Answer from "./type/answer";
import Question from "./type/question";
import PartQuestion from "./type/partQuestion";
export default defineComponent({
  name: "QuestionBankVue",
  components: {
    AddNewPopup,
    questionVue,
    deletePopup,
    duplicatePopup,
    addNewQuestionHandmade,
    selectQuestionFromCourse,
    SelectQuestionFromBank,
    statisticsPopup,
  },
  setup() {
    const {
      openAddNewBankModal,
      openDeleteQuestionModal,
      openDuplicateQuestionModal,
      openAddNewQuestionHandmadeModal,
      openSelectQuestionFromCourse,
      openSelectQuestionFromBank,
      openStatisticsBankModal,
    } = storeToRefs(usePopupStore());
    const { updateAddNewBankModalStatus } = usePopupStore();
    const { isLoading } = storeToRefs(usePopupStore());
    const { getCurrentBankQuestions, deleteQuestion } = useQuestionBankStore();
    const { currentBankQuestions } = storeToRefs(useQuestionBankStore());
    const currentBankQuestionFilter = ref<PartQuestion[]>([]);
    const answerListQuiz2 = ref<Answer[]>([]);
    const DesIndex = ref(0);
    const showAll = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(5);
    const pageSizeOptions = [5, 10, 20, 50];
    const pageLength = ref(0);
    const continuousIndex = ref(0);
    const showOnlyTheory = ref(false);
    const showOnlyEssay = ref(false);
    const filterArray = ref();
    const filterKey = ref("");
    const currentbankName = ref("");
    const createListAnswerQuiz2 = () => {
      if (currentBankQuestionFilter.value.length > 0) {
        currentBankQuestionFilter.value.forEach((part) => {
          if (part.Type == "QUIZ2") {
            part.Questions.forEach((questionData: Question) => {
              if (questionData.Answers) {
                questionData.Answers.forEach((answer) => {
                  answerListQuiz2.value = [...answerListQuiz2.value, answer];
                });
              }
            });
          }
        });
      }
    };
    const loadMathJax = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML";
      document.head.appendChild(script);

      // You may want to add a callback to ensure MathJax is loaded before rendering MathML content.
      script.onload = () => {
        // Render MathML content with MathJax.
        if (window.MathJax) {
          window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }
      };
    };
    const basicQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.LevelPart === 1)
    );
    const mediumQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.LevelPart === 2)
    );
    const advanceQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.LevelPart === 3)
    );
    const hardQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.LevelPart === 4)
    );
    const theoryQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.Type != "ESSAY")
    );
    const essayQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.Type == "ESSAY")
    );
    const getQuestionsByType = (questions: PartQuestion[], type: string) => {
      return questions.filter((question) => question.Type === type);
    };
    const handleUpdateFilterQuestions = (data: PartQuestion[], key: string) => {
      filterKey.value = key;
      currentBankQuestionFilter.value = data;
      pageLength.value = currentBankQuestionFilter.value.length;
      caculatorData(1);
    };
    const handleContentChange = () => {
      // Load MathJax for the new content
      loadMathJax();
    };
    onMounted(async () => {
      await getCurrentBankQuestions("64f7f457337edb68780c8d13");
      const bankName = localStorage.getItem("bankName");
      if (bankName) {
        currentbankName.value = bankName;
      }
    });
    // Caculator Data when change current page
    const caculatorData = (currentPage: number) => {
      if (currentPage * pageSize.value > currentBankQuestions.value.length) {
        currentBankQuestionFilter.value = currentBankQuestionFilter.value.slice(
          (currentPage - 1) * pageSize.value
        );
      } else {
        currentBankQuestionFilter.value = currentBankQuestionFilter.value.slice(
          (currentPage - 1) * pageSize.value,
          currentPage * pageSize.value
        );
      }
    };
    //Change page size
    const handlePageSizeChange = (current: any, size: any) => {
      console.log(`Page size changed to ${size}`);
      // You can perform any actions here when the page size changes
      pageSize.value = size; // Update the pageSize data property if needed
    };
    const validatelistQuestion = async () => {
      const data = await validateQuestion(currentBankQuestions.value);
      currentBankQuestions.value = data;
    };
    //Change bank
    watch(
      [currentBankQuestions, currentPage, showOnlyEssay, showOnlyTheory],
      async () => {
        if (showOnlyEssay.value || showOnlyTheory.value) {
          if (showOnlyEssay.value) {
            currentBankQuestionFilter.value = essayQuestions.value;
          } else {
            currentBankQuestionFilter.value = theoryQuestions.value;
          }
        } else {
          currentBankQuestionFilter.value = currentBankQuestions.value;
        }
        pageLength.value = currentBankQuestionFilter.value.length;
        if (currentBankQuestionFilter.value.length <= pageSize.value) {
          caculatorData(1);
        } else {
          caculatorData(currentPage.value);
        }
        await createListAnswerQuiz2();
        await handleContentChange();
      }
    );
    watch(currentBankQuestions, () => {
      filterArray.value = [
        {
          id: "Level1",
          levelQuestions: basicQuestions.value,
          name: "Nhận biết",
          typeQuestions: [
            {
              id: "Level1-QUIZ1",
              name: "Chọn một",
              data: getQuestionsByType(basicQuestions.value, "QUIZ1"),
            },
            {
              id: "Level1-QUIZ2",
              name: "Điền từ",
              data: getQuestionsByType(basicQuestions.value, "QUIZ2"),
            },
            {
              id: "Level1-QUIZ3",
              name: "Matching",
              data: getQuestionsByType(basicQuestions.value, "QUIZ3"),
            },
            {
              id: "Level1-QUIZ4",
              name: "Chọn nhiều",
              data: getQuestionsByType(basicQuestions.value, "QUIZ4"),
            },
            {
              id: "Level1-ESSAY",
              name: "Tự luận",
              data: getQuestionsByType(basicQuestions.value, "ESSAY"),
            },
          ],
        },
        {
          id: "Level2",
          levelQuestions: mediumQuestions.value,
          name: "Thông hiểu",
          typeQuestions: [
            {
              id: "Level2-QUIZ1",
              name: "Chọn một",
              data: getQuestionsByType(mediumQuestions.value, "QUIZ1"),
            },
            {
              id: "Level2-QUIZ2",
              name: "Điền từ",
              data: getQuestionsByType(mediumQuestions.value, "QUIZ2"),
            },
            {
              id: "Level2-QUIZ3",
              name: "Matching",
              data: getQuestionsByType(mediumQuestions.value, "QUIZ3"),
            },
            {
              id: "Level2-QUIZ4",
              name: "Chọn nhiều",
              data: getQuestionsByType(mediumQuestions.value, "QUIZ4"),
            },
            {
              id: "Level2-ESSAY",
              name: "Tự luận",
              data: getQuestionsByType(mediumQuestions.value, "ESSAY"),
            },
          ],
        },
        {
          id: "Level3",
          levelQuestions: advanceQuestions.value,
          name: "Vận dụng",
          typeQuestions: [
            {
              id: "Level3-QUIZ1",
              name: "Chọn một",
              data: getQuestionsByType(advanceQuestions.value, "QUIZ1"),
            },
            {
              id: "Level3-QUIZ2",
              name: "Điền từ",
              data: getQuestionsByType(advanceQuestions.value, "QUIZ2"),
            },
            {
              id: "Level3-QUIZ3",
              name: "Matching",
              data: getQuestionsByType(advanceQuestions.value, "QUIZ3"),
            },
            {
              id: "Level3-QUIZ4",
              name: "Chọn nhiều",
              data: getQuestionsByType(advanceQuestions.value, "QUIZ4"),
            },
            {
              id: "Level3-ESSAY",
              name: "Tự luận",
              data: getQuestionsByType(advanceQuestions.value, "ESSAY"),
            },
          ],
        },
        {
          id: "Level4",
          levelQuestions: hardQuestions.value,
          name: "Vận dụng cao",
          typeQuestions: [
            {
              id: "Level4-QUIZ1",
              name: "Chọn một",
              data: getQuestionsByType(hardQuestions.value, "QUIZ1"),
            },
            {
              id: "Level4-QUIZ2",
              name: "Điền từ",
              data: getQuestionsByType(hardQuestions.value, "QUIZ2"),
            },
            {
              id: "Level4-QUIZ3",
              name: "Matching",
              data: getQuestionsByType(hardQuestions.value, "QUIZ3"),
            },
            {
              id: "Level4-QUIZ4",
              name: "Chọn nhiều",
              data: getQuestionsByType(hardQuestions.value, "QUIZ4"),
            },
            {
              id: "Level4-ESSAY",
              name: "Tự luận",
              data: getQuestionsByType(hardQuestions.value, "ESSAY"),
            },
          ],
        },
      ];
      filterArray.value = filterArray.value.map((filterQuestion: any) => {
        filterQuestion.typeQuestions = filterQuestion.typeQuestions.filter(
          (question: any) => {
            return question.data.length > 0;
          }
        );
        return filterQuestion;
      });
      filterArray.value = filterArray.value.filter(
        (filterQuestion: any) => filterQuestion.levelQuestions.length > 0
      );
    });
    return {
      openAddNewQuestionHandmadeModal,
      openSelectQuestionFromCourse,
      openAddNewBankModal,
      openDeleteQuestionModal,
      openDuplicateQuestionModal,
      leftIcon,
      currentBankQuestions,
      openSelectQuestionFromBank,
      openStatisticsBankModal,
      loadingIcon,
      isLoading,
      answerListQuiz2,
      currentBankQuestionFilter,
      basicQuestions,
      mediumQuestions,
      advanceQuestions,
      hardQuestions,
      DesIndex,
      currentbankName,
      currentPage,
      pageSize,
      pageLength,
      pageSizeOptions,
      filterArray,
      continuousIndex,
      filterKey,
      showOnlyEssay,
      showOnlyTheory,
      showAll,
      validateQuestion,
      handlePageSizeChange,
      updateAddNewBankModalStatus,
      deleteQuestion,
      handleUpdateFilterQuestions,
      getCurrentBankQuestions,
      validatelistQuestion,
    };
  },
});
</script>
<style>
body {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
  min-height: 100vh;
}
.breadcrumb {
  color: #00000073;
  font-size: 14px;
  font-style: italic;
}
.question-detail .ql-container.ql-snow {
  min-height: 50px;
}
.question-bank-detail .list-question {
  max-height: calc(100vh - 250px);
}
.filter-list {
  max-height: calc(100vh - 550px);
}
</style>
