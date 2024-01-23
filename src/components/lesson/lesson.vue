<template>
  <div class="overflow-hidden">
    <div
      @click="toggleLesson(lesson)"
      class="text-red-500 text-sm flex font-medium py-2 items-center cursor-pointer"
      v-if="lesson.Title"
    >
      {{ lessonIndex + 1 }} . {{ lesson.Title }}
      <span class="ml-1 cursor-pointer" :id="`icon-lesson-${lesson.ID}`"
        ><img
          class="w-6 h-6"
          :src="showListQuestion ? arrowTop : arrowDown"
          alt=""
      /></span>
    </div>
    <div class="hidden" :id="`lesson-${lesson.ID}`">
      <questionViewInLesson
        v-for="question in lesson.partQuestion"
        :key="question.ID"
        :question="question"
      />
    </div>
    <div
      class="text-red-500 text-sm flex font-medium py-2"
      v-if="!lesson.Title"
    >
      Không có dữ liệu
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import arrowTop from "../../assets/image/arrow-top.svg";
import arrowDown from "../../assets/image/arrow-down.svg";
import folderIcon from "../../assets/image/folder.svg";
import questionViewInLesson from "../question/questionViewInLesson.vue";
import { storeToRefs } from "pinia";
import { useSelectQuestionStore } from "../../stores/question-select-flow-store";
import Lesson from "../../type/lesson";
export default defineComponent({
  name: "LessonVue",
  components: {
    questionViewInLesson,
  },
  props: {
    lesson: {
      type: Object,
      required: true,
    },
    lessonIndex: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const showListQuestion = ref(false);
    const { listLessonParts, isFillDesOnetime, tagsNameOneTime } = storeToRefs(
      useSelectQuestionStore()
    );
    const { loadPartQuestions } = useSelectQuestionStore();
    const toggleLesson = async (obj: Lesson) => {
      if (obj.partQuestion == null) {
        obj.partQuestion = await loadPartQuestions(obj.ID);
        obj.partQuestion = obj.partQuestion.map((part) => {
          if (isFillDesOnetime) {
            return { ...part, TagsName: tagsNameOneTime.value };
          }
          return { ...part };
        });
      }
      const currentElement = document.getElementById(`lesson-${obj.ID}`);
      const iconElement = document.getElementById(`icon-lesson-${obj.ID}`);
      if (currentElement && iconElement) {
        currentElement.classList.toggle("hidden");
        iconElement.classList.toggle("rotate-180");
      }
    };
    return {
      showListQuestion,
      arrowDown,
      arrowTop,
      folderIcon,
      listLessonParts,
      toggleLesson,
    };
  },
});
</script>
<style></style>
