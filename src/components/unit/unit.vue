<template>
  <div class="">
    <p
      @click="toggleUnit(unit as Unit)"
      class="text-blue-500 font-semibold ml-5 flex items-center cursor-pointer"
    >
      <span class="mr-2"><img class="w-6 h-6" :src="folderIcon" alt="" /></span
      >{{ unit.Name }}
      <span class="ml-2 cursor-pointer"
        ><img
          :id="`icon-unit-${unit.ID}`"
          class="w-6 h-6"
          :src="arrowDown"
          alt=""
      /></span>
    </p>
    <div class="hidden ml-8" :id="`unit-${unit.ID}`">
      <LessonVue
        v-for="lesson in unit.Lessons"
        :key="lesson.ID"
        :lesson="lesson"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import arrowDown from "../../assets/image/arrow-down.svg";
import folderIcon from "../../assets/image/folder.svg";
import { useSelectQuestionStore } from "@/stores/question-select-flow-store";
import { storeToRefs } from "pinia";
import LessonVue from "../lesson/lesson.vue";
import Lesson from "../../type/lesson";
import Unit from "../../type/unit";
export default defineComponent({
  name: "UnitVue",
  components: {
    LessonVue,
  },
  props: {
    unit: {
      type: Object,
      required: true,
    },
    courseID: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const showListPart = ref(false);
    const { loadLesson } = useSelectQuestionStore();
    const { listLessons } = storeToRefs(useSelectQuestionStore());
    const filterLesson = (obj: Lesson) => {
      let array = listLessons.value.filter((p) => {
        return p.CourseID == obj.CourseID;
      });
      array[0] = { ...array[0], partQuestion: null };
      if (array.length != 0) return array;
    };
    const toggleUnit = async (obj: Unit) => {
      await loadLesson(obj.ID);
      if (obj.Lessons == null) {
        obj.Lessons = filterLesson({
          ID: obj.ID,
          CourseID: props.courseID,
          ChapterID: "",
        }) as Lesson[];
      }
      const currentElement = document.getElementById(`unit-${obj.ID}`);
      const iconElement = document.getElementById(`icon-unit-${obj.ID}`);
      if (currentElement && iconElement) {
        currentElement.classList.toggle("hidden");
        iconElement.classList.toggle("rotate-180");
      }
    };
    return {
      showListPart,
      arrowDown,
      folderIcon,
      listLessons,
      loadLesson,
      filterLesson,
      toggleUnit,
    };
  },
});
</script>
<style></style>
