<template>
  <div
    class="border border-dashed border-gray-300 relative p-2.5 pt-5 mutiple-choice mb-5"
  >
    <div>
      <span
        class="text-indigo text-lg font-semibold absolute -top-4 bg-white px-2"
        >Câu hỏi thứ {{ index + 1 }}</span
      >
      <span
        @click="removeQuestion && removeQuestion(question.ID)"
        class="absolute -top-4 right-4 cursor-pointer bg-white"
      >
        <img class="w-8 h-8" :src="binIcon" alt="" />
      </span>
      <CKEditorCustom
        :model-value="questionContent"
        @update:model-value="(newValue:any) => (questionContent = newValue)"
      />
      <!-- <QuillEditor
        contentType="html"
        toolbar="full"
        theme="bubble"
        class="border rounded"
        v-model:content="questionContent"
        @update:content="updateQuestionContent(question.ID, questionContent)"
      /> -->
    </div>
    <!-- Answer  -->
    <div>
      <div class="text-indigo text-lg my-4">Trả lời (đánh dấu nếu đúng)</div>
      <!-- Card  -->
      <div class="flex flex-wrap">
        <div
          v-for="(answer, index) in answerArray"
          :key="answer.ID"
          class="w-1/2 px-2"
        >
          <div
            class="border border-indigo p-2.5 pr-8 pt-10 rounded-lg relative block w-full mb-6"
          >
            <div class="text-indigo absolute font-semibold top-4">
              Đáp án {{ index + 1 }}
            </div>
            <div
              @click="removeAnswer(answer.ID)"
              class="font-bold inline-block px-2 py-0.5 border rounded-full absolute -top-3 -right-3 text-gray-400 bg-white hover:text-black-lighter hover:border-black-lighter cursor-pointer"
            >
              X
            </div>
            <CKEditorCustom
              :model-value="answer.Content"
              @update:model-value="(newValue:any) => (answer.Content = newValue)"
            />
            <!-- <QuillEditor
              contentType="html"
              toolbar="full"
              theme="snow"
              class="border rounded"
              v-model:content="answer.Content"
              @update:content="updateQuestionAnswer(question.ID, answerArray)"
            /> -->
            <input
              class="absolute top-2 right-5 w-5 h-5 cursor-pointer"
              type="checkbox"
              :id="answer.ID"
              v-model="answer.IsCorrect"
              @input="updateQuestionAnswer(question.ID, answerArray)"
            />
          </div>
        </div>
      </div>

      <button
        @click="addNewAnswer"
        class="text-indigo hover:text-green-500 text-lg my-2"
      >
        + Thêm đáp án
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import binIcon from "../../assets/image/noun-bin.svg";
import Answer from "../../type/answer";
import CKEditorCustom from "../custom/CKEditorCustom.vue";
export default defineComponent({
  name: "MultipleChoice",
  components: {
    CKEditorCustom,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    removeQuestion: Function,
    question: {
      type: Object,
      required: true,
    },
    updateQuestionContent: {
      type: Function,
      required: true,
    },
    updateQuestionAnswer: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const answerIndex = ref(0);
    const answerArray = ref<Answer[]>([]);
    const questionContent = ref("");
    const addNewAnswer = () => {
      const id = "id" + Math.random().toString(16).slice(2);
      answerArray.value = [
        ...answerArray.value,
        {
          ID: id,
          Media: null,
          Content: "",
          IsCorrect: false,
        },
      ];
      props.updateQuestionAnswer(props.question.ID, answerArray.value);
    };
    const removeAnswer = (id: string) => {
      answerArray.value = answerArray.value.filter((answer) => answer.ID != id);
      props.updateQuestionAnswer(props.question.ID, answerArray.value);
    };
    onMounted(() => {
      answerArray.value = props.question.Answers;
    });
    watch(questionContent, () => {
      props.updateQuestionContent(props.question.ID, questionContent.value);
    });
    return {
      answerIndex,
      answerArray,
      binIcon,
      questionContent,
      addNewAnswer,
      removeAnswer,
    };
  },
});
</script>

<style>
.mutiple-choice .ql-container.ql-snow {
  min-height: unset;
}
</style>
