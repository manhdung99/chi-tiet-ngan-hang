<template>
  <div class="question-bank-detail">
    <div class="save-button">
      <button
        :disabled="
          arrayDelete.length == 0 &&
          arrayAddnew.length == 0 &&
          arrayUpdate.length == 0
        "
        @click="addBank"
        class="button button-primary"
      >
        Lưu
      </button>
    </div>
    <!-- Header page  -->
    <!-- <div class="page-header bg-white px-6 py-5">
      <span class="breadcrumb">Home/ Khảo thí / Tiếng Anh</span>
      <div class="flex justify-between items-center">
        <div class="font-semibold text-xl flex items-center">
          <span class="cursor-pointer mr-4"
            ><img :src="leftIcon" alt=""
          /></span>
          Tạo ngân hàng câu hỏi
        </div>
        <div class="save-button">
          <button @click="addBank" class="button button-primary">Lưu</button>
        </div>
      </div>
    </div>
    <div class="page-body relative p-6 pb-0"> -->
    <div class="page-body relative pb-0">
      <div class="flex justify-between">
        <!-- Question  -->
        <div class="flex-1 mr-9">
          <div class="flex justify-between">
            <div>
              <div class="text-sm font-bold">
                <span class="text-red-500">*</span> Tên ngân hàng câu hỏi
              </div>
              <input v-model="currentbankName" class="input" type="text" />
              <div
                v-if="
                  bankNameError &&
                  (!currentbankName || currentbankName.length == 0)
                "
                class="text-red-500 text-sm"
              >
                Chưa có tên ngân hàng
              </div>
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
          <div class="list-question mt-4 scroll">
            <questionVue
              v-for="(question, index) in currentBankQuestionFilter"
              :key="question.ID"
              :questionPart="question"
              :index="index"
              :canEdit="true"
              :answerListQuiz2="answerListQuiz2"
              :showAll="showAll"
              :currentBankQuestionFilter="currentBankQuestionFilter"
            />
          </div>
          <div
            class="text-red-500"
            v-if="currentBankQuestionFilter.length == 0 && !isLoading"
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
        <div class="flex flex-col top-4 w-48">
          <button
            @click="updateAddNewBankModalStatus(true)"
            class="button button-primary"
          >
            Thêm câu hỏi
          </button>
          <button
            v-if="showRemoveButton"
            @click="openRemoveModal = true"
            class="button bg-white text-red-500 border border-gray-300 hover:border-red-500 mt-4"
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
              @click="getQuestionsByKey('')"
              class="border-b py-2.5 cursor-pointer pl-1"
              :class="filterKey == '' ? 'bg-gray' : ''"
            >
              Tất cả ({{ currentBankQuestions.length }})
            </div>
            <div class="filter-list scroll">
              <div v-for="(tag, index) in listTagName" :key="tag.name">
                <div
                  @click="getQuestionsByKey(tag.name)"
                  class="border-b py-2.5 cursor-pointer pl-1"
                  :class="filterKey == tag.name ? 'bg-gray' : ''"
                >
                  {{ index + 1 }}. {{ tag.name }}
                </div>
                <div v-if="tag.child.length > 0">
                  <div
                    v-for="(childTag, childIndex) in tag.child"
                    :key="childTag.name"
                    @click="getQuestionsByKey(tag.name, childTag.name)"
                    class="border-b py-2.5 pl-4 cursor-pointer"
                    :class="
                      filterKey == tag.name + childTag.name ? 'bg-gray' : ''
                    "
                  >
                    {{ index + 1 }}.{{ childIndex + 1 }} {{ childTag.name }}
                  </div>
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
    <ImportFromFile v-if="openImportFromFile" />
  </Teleport>
  <Teleport to="body">
    <div
      v-if="isLoading"
      class="fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center bg-custom-modal z-10"
    >
      <img :src="loadingIcon" alt="" />
    </div>
  </Teleport>
  <!-- Remove modal  -->
  <Teleport to="body">
    <div
      v-if="openRemoveModal"
      class="fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center bg-custom-modal z-10"
    >
      <div>Bạn chắc chắn muốn xóa ngân hàng ?</div>
      <div>
        <div
          class="w-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-lg z-10"
        >
          <h2 class="mb-4">
            Bạn có chắc chắn muốn xoá ngân hàng
            <span class="text-red font-bold"> {{ currentbankName }} </span>?
          </h2>
          <div class="flex justify-end">
            <button
              @click="removeBank()"
              class="bg-red-500 text-white py-2 px-4 rounded mr-4 hover:opacity-90"
            >
              Xoá
            </button>
            <button
              @click="openRemoveModal = false"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:opacity-90"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  <Teleport to="body">
    <addNewSuccess v-if="openAddnewSuccess" :subjectID="subjectID" />
  </Teleport>
</template>

<script lang="ts">
declare global {
  interface Window {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
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
import ImportFromFile from "@/components/popup/importQuestionFromFile.vue";
import statisticsPopup from "@/components/popup/statisticsPopup.vue";
import addNewSuccess from "./components/popup/addNewSuccess.vue";
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
    ImportFromFile,
    statisticsPopup,
    addNewSuccess,
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
      openImportFromFile,
      openAddnewSuccess,
    } = storeToRefs(usePopupStore());
    const { updateAddNewBankModalStatus } = usePopupStore();
    const { isLoading } = storeToRefs(usePopupStore());
    const {
      getCurrentBankQuestions,
      deleteQuestion,
      updateSubjectID,
      addOrUpdateBank,
      removeBankByID,
    } = useQuestionBankStore();
    const {
      currentBankQuestions,
      arrayAddnew,
      arrayDelete,
      arrayUpdate,
      subjectID,
      bankID,
    } = storeToRefs(useQuestionBankStore());
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
    const showRemoveButton = ref(false);
    const filterKey = ref("");
    const openRemoveModal = ref(false);
    const currentbankName = ref("");
    const listTagName = ref<any[]>([]);
    const bankNameError = ref(false);
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
    // Save bank to DB
    const addBank = async () => {
      if (currentbankName.value && currentbankName.value.length > 0) {
        if (subjectID.value == "") {
          subjectID.value = localStorage.getItem("subjectID") as string;
        }
        arrayAddnew.value = arrayAddnew.value.map((data) => {
          return { ...data, TagsName: data.TagsName?.replace("-", ",") };
        });
        arrayUpdate.value = arrayUpdate.value.map((data) => {
          return { ...data, TagsName: data.TagsName?.replace("-", ",") };
        });
        await addOrUpdateBank(
          bankID.value,
          currentbankName.value,
          subjectID.value,
          arrayAddnew.value,
          arrayUpdate.value,
          arrayDelete.value
        );
        if (bankID.value.length > 0) {
          localStorage.removeItem(`bank-${bankID.value}`);
        }
      } else {
        bankNameError.value = true;
      }
    };
    // Remove bank and back to list
    const removeBank = async () => {
      const url =
        window.location.origin +
        "/eduso/teacher/ExamManage#quiz_" +
        subjectID.value;
      if (bankID.value != "") {
        await removeBankByID(bankID.value);
      }
      window.location.replace(url);
    };
    //Load Mathjax
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
    //Question type Nhận biết
    const basicQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.LevelPart === 1)
    );
    //Question type thông hiểu
    const mediumQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.LevelPart === 2)
    );
    //Question type vận dụng
    const advanceQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.LevelPart === 3)
    );
    //Question type vận dụng cao
    const hardQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.LevelPart === 4)
    );
    //Question lý thuyết
    const theoryQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.Type != "ESSAY")
    );
    //Question bài tập
    const essayQuestions = computed(() =>
      currentBankQuestions.value.filter((question) => question.Type == "ESSAY")
    );
    //Get question by QUIZ
    const getQuestionsByKey = (parentKey: string, childKey = "") => {
      let data;
      if (parentKey == "") {
        filterKey.value = "";
        data = currentBankQuestions.value;
      } else if (childKey == "") {
        filterKey.value = parentKey;
        data = currentBankQuestions.value.filter((question: PartQuestion) => {
          if (question.TagsName && !question.ListTags) {
            const tagArray = question.TagsName.split("-");
            return tagArray.length > 0 && tagArray[0].includes(parentKey);
          } else {
            return (
              question.ListTags && question.ListTags[0].name.includes(parentKey)
            );
          }
        });
      } else {
        filterKey.value = parentKey + childKey;
        data = currentBankQuestions.value.filter((question: PartQuestion) => {
          if (question.TagsName && !question.ListTags) {
            return (
              question.TagsName.includes(parentKey) &&
              question.TagsName.includes(childKey)
            );
          } else {
            question.ListTags &&
              question.ListTags[0].name.includes(parentKey) &&
              question.ListTags[1].name.includes(childKey);
          }
        });
      }
      data = data.map((o, index) => {
        return { ...o, dataIndex: index };
      });

      currentBankQuestionFilter.value = data;
      pageLength.value = currentBankQuestionFilter.value.length;
      caculatorData(1);
    };
    //Load Mathjax when change content
    const handleContentChange = () => {
      // Load MathJax for the new content
      loadMathJax();
    };
    onMounted(async () => {
      const paramURLArray = window.location.pathname.split("/");
      const lastParam = paramURLArray[paramURLArray.length - 1];

      if (lastParam.includes("create")) {
        updateSubjectID(lastParam.split("_")[1]);
        showRemoveButton.value = false;
      } else {
        updateSubjectID(localStorage.getItem("subjectID") as string);
        showRemoveButton.value = true;
        bankID.value = lastParam;
      }
      let bank = localStorage.getItem(`bank-${bankID.value}`);

      if (bank) {
        const bankData = JSON.parse(bank);
        console.log(bankData.currentBankQuestions);

        currentBankQuestions.value = bankData.currentBankQuestions;
        arrayAddnew.value = bankData.arrayAddnew;
        arrayUpdate.value = bankData.arrayUpdate;
        arrayDelete.value = bankData.arrayDelete;
      } else {
        await getCurrentBankQuestions(bankID.value);
      }
      const bankName = localStorage.getItem("bankName");
      if (bankName == "" || bankName == "Tạo mới") {
        currentbankName.value = "";
      } else {
        currentbankName.value = bankName as string;
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
      [
        currentBankQuestions,
        currentPage,
        showOnlyEssay,
        showOnlyTheory,
        pageSize,
      ],
      async () => {
        let partQuestions = [];
        if (showOnlyEssay.value || showOnlyTheory.value) {
          if (showOnlyEssay.value) {
            partQuestions = essayQuestions.value;
          } else {
            partQuestions = theoryQuestions.value;
          }
        } else {
          partQuestions = currentBankQuestions.value;
        }
        partQuestions = partQuestions.map((part, index) => {
          return { ...part, dataIndex: index };
        });
        currentBankQuestionFilter.value = [...partQuestions];
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
    const checkUniqueArray = (originalArray: any) => {
      let uniqueMap = new Map();
      originalArray.forEach((item: any) => uniqueMap.set(item.name, item));
      let uniqueArray = Array.from(uniqueMap.values());
      return uniqueArray;
    };
    watch(currentBankQuestions, () => {
      listTagName.value = currentBankQuestions.value.map((part: any) => {
        if (part.ListTags) {
          return part.ListTags;
        } else {
          if (part.TagsName.length > 0) {
            const array = part.TagsName.split("-") || part.TagsName.split(",");
            if (array) {
              return array.map((data: any) => {
                return { name: data };
              });
            }
          }
        }
      });
      let tagObject: { [key: string]: any[] } = {}; // Specify the type for tagObject
      let newArray: { name: string; child: any[] }[] = []; // Specify the type for returnArray
      listTagName.value.forEach((tag: any[]) => {
        if (tag && tag.length > 0) {
          const first = tag[0];
          const name = first.name;
          const obj = tagObject[name];
          const array = tag.slice(1); // Use slice instead of splice
          if (obj) {
            tagObject[name] = obj.concat(array);
          } else {
            newArray.push(first);
            tagObject[name] = array;
          }
        }
      });
      listTagName.value = newArray.map((data) => {
        return {
          name: data.name,
          child: checkUniqueArray(tagObject[data.name]),
        };
      });

      // Add data to localstorage
      if (bankID.value.length > 0) {
        const data = {
          bankID: bankID.value,
          currentBankQuestions: currentBankQuestions.value,
          arrayAddnew: arrayAddnew.value,
          arrayUpdate: arrayUpdate.value,
          arrayDelete: arrayDelete.value,
        };
        window.localStorage.setItem(
          `bank-${bankID.value}`,
          JSON.stringify(data)
        );
      }
    });
    watch([showOnlyEssay, showOnlyTheory], () => {
      filterKey.value = "";
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
      arrayUpdate,
      arrayDelete,
      arrayAddnew,
      openRemoveModal,
      openImportFromFile,
      subjectID,
      openAddnewSuccess,
      showRemoveButton,
      listTagName,
      bankNameError,
      validateQuestion,
      handlePageSizeChange,
      updateAddNewBankModalStatus,
      deleteQuestion,
      getCurrentBankQuestions,
      validatelistQuestion,
      addBank,
      removeBank,
      getQuestionsByKey,
    };
  },
});
</script>
<style>
#app.card-body {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.question-detail .ql-container.ql-snow {
  min-height: 50px;
}
.question-bank-detail .list-question {
  max-height: calc(100vh - 250px);
  padding: 2px;
  padding-right: 4px;
}
.filter-list {
  max-height: calc(100vh - 550px);
}
.save-button {
  position: absolute;
  top: 24px;
  right: 32px;
  border-radius: 4px;
}
</style>
