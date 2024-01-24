<template>
  <div class="custom-modal select-bank-custom-modal-content">
    <div
      v-if="!openListSelected"
      class="bg-white rounded-sm select-question-from-bank max-h-screen w-full relative"
    >
      <div class="select-bank-modal-content">
        <div
          class="flex items-center justify-between text-indigo text-lg border-b p-4"
        >
          <div class="flex w-full justify-between mr-6 items-center">
            <span>Chọn từ ngân hàng</span>
            <span
              @click="openListSelected = true"
              class="text-sm font-semibold cursor-pointer hover:underline"
              >Đã chọn {{ currentQuestionPartSelected.length }} câu</span
            >
            <div
              v-if="currentListPartQuestion.length > 0"
              class="absolute flex ml-1/4"
            >
              <span
                ><input
                  :checked="checkAll"
                  class="cursor-pointer"
                  @click="checkAllQuestion()"
                  type="checkbox"
              /></span>
              <span class="ml-4">Chọn tất cả</span>
            </div>
          </div>
          <span
            @click="updateSelectQuestionFromBankStatus(false)"
            class="cursor-pointer"
            ><img :src="closeIcon" alt=""
          /></span>
        </div>
        <div class="main-content">
          <!-- List ngân hàng  -->
          <div class="list-bank scroll">
            <ul>
              <li v-for="bank in bankList" :key="bank.ID" class="">
                <div
                  @click="toggleTag(bank)"
                  class="flex hover:underline cursor-pointer"
                >
                  <span class="mr-2"
                    ><img class="w-4 h-4" :src="inboxIcon" alt=""
                  /></span>
                  <div class="text-sm text-indigo font-semibold">
                    {{ bank.Name }}
                  </div>
                </div>
                <div>
                  <ul class="tree hidden pl-4" :data-storeid="bank.ID">
                    <li v-for="tag in bank.Tags" :key="tag.ID">
                      <template v-if="tag.ParentIDs == null">
                        <div
                          class="text-sm text-indigo font-semibold hover:underline cursor-pointer"
                          @click="getListPartByTag(bank, tag)"
                        >
                          <span>--- {{ tag.Name }}</span>
                        </div>
                      </template>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <!-- Câu hỏi của ngân hàng  -->
          <div class="flex-1">
            <div class="text-indigo text-sm font-semibold" v-if="isLoading">
              Đang tải dữ liệu ...
            </div>
            <div class="h-full" v-else>
              <div
                class="list-question-part scroll h-full"
                v-if="currentListPartQuestion.length > 0"
              >
                <div
                  v-for="(question, index) in currentListPartQuestion"
                  :key="question.ID"
                  class="flex items-center w-full"
                >
                  <div class="mr-2">
                    <input
                      :checked="
                        currentSelectedPartQuestionsID.includes(question.ID)
                      "
                      @click="updateListSelectedQuestion(question)"
                      class="cursor-pointer"
                      type="checkbox"
                    />
                  </div>
                  <selectedQuestionBank
                    :questionPart="question"
                    :index="index"
                    :answerListQuiz2="answerListQuiz2"
                    class="border flex-1"
                  />
                </div>
              </div>
              <div class="text-indigo text-sm font-semibold ml-2" v-else>
                Không có dữ liệu
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex p-2.5 justify-end border-t absolute bottom-0 w-full">
        <button
          @click="updateSelectQuestionFromBankStatus(false)"
          class="text-white text-sm bg-red-500 px-4 py-2 rounded mr-1 hover:opacity-80"
        >
          Huỷ
        </button>
        <button
          @click="saveData"
          class="text-white text-sm bg-blue-700 px-4 py-2 rounded ml-1 hover:opacity-80"
        >
          Lưu
        </button>
      </div>
    </div>
    <div
      v-else
      class="bg-white rounded-sm select-question-from-bank max-h-screen w-full relative"
    >
      <div class="select-bank-modal-content-part2">
        <div
          class="flex items-center justify-between text-indigo text-lg border-b p-4"
        >
          <div class="flex w-full justify-between mr-6 items-center">
            <span>Câu hỏi đã chọn </span>
            <div class="flex items-center">
              <button
                @click="validatelistSelectedQuestion"
                class="button button-primary text-sm mr-4"
              >
                Kiểm tra lỗi
              </button>
              <span class="text-sm font-semibold"
                >Tổng số câu :
                {{ currentQuestionPartSelected.length }} câu</span
              >
            </div>
          </div>
          <span @click="openListSelected = false" class="cursor-pointer"
            ><img :src="closeIcon" alt=""
          /></span>
        </div>
        <div class="list-question-selected scroll">
          <!-- Câu hỏi của ngân hàng  -->
          <div class="flex-1">
            <div class="text-indigo text-sm font-semibold" v-if="isLoading">
              Đang tải dữ liệu ...
            </div>
            <div class="h-full" v-else>
              <div
                class="list-question-part scroll h-full"
                v-if="currentQuestionPartSelected.length > 0"
              >
                <div
                  v-for="(question, index) in currentQuestionPartSelected"
                  :key="question.ID"
                  class="flex items-center w-full"
                >
                  <selectedQuestionBankPart2
                    :questionPart="question"
                    :index="index"
                    :answerListQuiz2="answerListQuiz2"
                    class="border flex-1"
                    :removeQuestionInListSelected="removeQuestionInListSelected"
                  />
                </div>
              </div>
              <div class="text-indigo text-sm font-semibold ml-2" v-else>
                Không có dữ liệu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import inboxIcon from "../../assets/image/noun-inbox.svg";
import closeIcon from "../../assets/image/close-icon.svg";
import { usePopupStore } from "@/stores/popup";
import { useSelectQuestionFromBank } from "@/stores/question-select-from-bank";
import { storeToRefs } from "pinia";
import selectedQuestionBank from "../question/selectedQuestionBank/questionSelectedBank.vue";
import selectedQuestionBankPart2 from "../question/selectedQuestionBank/questionSelectedBankPart2.vue";
import Bank from "../../type/bank";
import PartQuestion from "../../type/partQuestion";
import { useQuestionBankStore } from "@/stores/question-bank-store";
import { addStaticLink } from "../../uses/addStaticLink";
import Answer from "../../type/answer";
import Question from "../../type/question";
import { validateQuestion } from "../../uses/function";
import Tag from "@/type/tag";
export default defineComponent({
  name: "SelectQuestionBank",
  components: {
    selectedQuestionBank,
    selectedQuestionBankPart2,
  },
  setup() {
    const isLoading = ref(false);
    const { updateSelectQuestionFromBankStatus } = usePopupStore();
    const { getBanks, getTagQuiz, getListPart } = useSelectQuestionFromBank();
    const { bankList } = storeToRefs(useSelectQuestionFromBank());
    const { addQuestionToCurrentList } = useQuestionBankStore();
    const { arrayAddnew } = storeToRefs(useQuestionBankStore());
    const answerListQuiz2 = ref<Answer[]>([]);
    const openListSelected = ref(false);
    const checkAll = ref(false);
    const currentSelectedPartQuestionsID = ref<Array<string>>([]);
    const toggleTag = (obj: Bank) => {
      const id = obj.ID;
      if (obj.Tags == null) {
        getTagQuiz(obj);
      }
      const currentElement = document.querySelector(
        'ul[data-storeid="' + id + '"]'
      );
      if (currentElement) {
        currentElement.classList.toggle("hidden");
      }
    };
    const checkAllQuestion = () => {
      checkAll.value = !checkAll.value;
      if (checkAll.value) {
        if (currentQuestionPartSelected.value.length == 0) {
          currentQuestionPartSelected.value = [
            ...currentListPartQuestion.value,
          ];
        } else {
          currentListPartQuestion.value.forEach((part) => {
            if (!currentSelectedPartQuestionsID.value.includes(part.ID)) {
              currentQuestionPartSelected.value = [
                ...currentQuestionPartSelected.value,
                part,
              ];
            }
          });
        }
      } else {
        currentListPartQuestion.value.forEach((part) => {
          if (currentSelectedPartQuestionsID.value.includes(part.ID)) {
            currentQuestionPartSelected.value =
              currentQuestionPartSelected.value.filter(
                (selectedPart) => part.ID != selectedPart.ID
              );
          }
        });
      }
    };
    const saveData = () => {
      addQuestionToCurrentList(currentQuestionPartSelected.value);
      arrayAddnew.value = [
        ...arrayAddnew.value,
        ...currentQuestionPartSelected.value,
      ];
      currentQuestionPartSelected.value = [];
      updateSelectQuestionFromBankStatus(false);
    };
    const currentListPartQuestion = ref<Array<PartQuestion>>([]);
    const currentQuestionPartSelected = ref<Array<PartQuestion>>([]);
    const getListPartByTag = async (bank: Bank, tag: Tag) => {
      checkAll.value = false;
      isLoading.value = true;
      currentListPartQuestion.value = await getListPart(bank, tag);
      currentListPartQuestion.value.forEach((part) => {
        part.Description = addStaticLink(part.Description);
        part.Questions.forEach((question) => {
          question.Content = addStaticLink(question.Content);
        });
      });
      createListAnswerQuiz2();
      isLoading.value = false;
    };

    const updateListSelectedQuestion = (partQuestions: PartQuestion) => {
      if (currentQuestionPartSelected.value.length > 0) {
        if (currentSelectedPartQuestionsID.value.includes(partQuestions.ID)) {
          currentQuestionPartSelected.value =
            currentQuestionPartSelected.value.filter(
              (question) => question.ID != partQuestions.ID
            );
        } else {
          currentQuestionPartSelected.value = [
            partQuestions,
            ...currentQuestionPartSelected.value,
          ];
        }
      } else {
        currentQuestionPartSelected.value = [
          partQuestions,
          ...currentQuestionPartSelected.value,
        ];
      }
    };
    const removeQuestionInListSelected = (id: string) => {
      currentQuestionPartSelected.value =
        currentQuestionPartSelected.value.filter(
          (question) => question.ID != id
        );
    };
    const createListAnswerQuiz2 = () => {
      currentListPartQuestion.value.forEach((part) => {
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
    };
    const validatelistSelectedQuestion = async () => {
      const data = await validateQuestion(currentQuestionPartSelected.value);
      currentQuestionPartSelected.value = data;
    };
    onMounted(() => {
      getBanks();
    });
    watch(currentQuestionPartSelected, () => {
      currentSelectedPartQuestionsID.value =
        currentQuestionPartSelected.value.map(
          (question) => question.ID as string
        );
    });
    return {
      isLoading,
      closeIcon,
      inboxIcon,
      bankList,
      currentListPartQuestion,
      currentQuestionPartSelected,
      currentSelectedPartQuestionsID,
      answerListQuiz2,
      openListSelected,
      checkAll,
      updateSelectQuestionFromBankStatus,
      getTagQuiz,
      toggleTag,
      getListPartByTag,
      updateListSelectedQuestion,
      saveData,
      removeQuestionInListSelected,
      validatelistSelectedQuestion,
      checkAllQuestion,
    };
  },
});
</script>
<style>
.select-question-from-bank .list-bank {
  max-width: 25%;
  height: 100%;
}
.scroll {
  overflow-y: auto;
}
.scroll::-webkit-scrollbar-thumb {
  background: #000;
}
.scroll::-webkit-scrollbar {
  width: 2px;
}
.scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
.select-bank-custom-modal-content {
  max-height: 100vh;
  overflow: hidden;
}
.select-bank-custom-modal-content-part2 {
  max-height: 100vh;
}
.select-question-from-bank .main-content {
  height: calc(100vh - 118px);
  padding: 16px;
  display: flex;
}
.select-question-from-bank .list-question-part {
  padding: 0 8px;
}
.list-question-selected {
  height: calc(100vh - 62px);
  padding: 16px;
}
</style>
