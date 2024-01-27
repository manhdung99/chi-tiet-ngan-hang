<template>
  <div class="custom-modal">
    <div
      class="bg-white rounded-sm p-4 select-question-from-course max-h-screen relative"
    >
      <div class="select-custom-modal-content h-full scroll-area">
        <div
          class="flex items-center justify-between font-semibold text-xl border-b pb-2"
        >
          Chọn từ học liệu Eduso
          <span
            @click="
              currentSelectedQuestion = [];
              updateSelectQuestionFromCourseStatus(false);
            "
            class="cursor-pointer"
            ><img :src="closeIcon" alt=""
          /></span>
        </div>
        <div>
          <div class="text-sm font-bold mt-2 mb-4">1. Thiết lập nội dung</div>
          <div class="mt-2">
            <div class="text-sm font-bold mb-4">Chọn cách nhập nội dung</div>
            <div class="flex items-center text-sm">
              <div class="mr-8 flex items-center">
                <input
                  v-model="selectedOption"
                  value="onetime"
                  class="mr-2"
                  type="radio"
                  name="type"
                />
                <span>Nhập 1 lần và áp dụng tất cả</span>
              </div>
              <div class="flex items-center">
                <input
                  v-model="selectedOption"
                  value="eachsentence"
                  class="mr-2"
                  type="radio"
                  name="type"
                />
                <span>Nhập từng câu</span>
              </div>
            </div>
          </div>
          <div class="mt-4 w-full">
            <div class="text-sm font-bold mb-1">Nhập nội dung</div>
            <input
              :disabled="!isFillDesOnetime"
              class="input w-1/2 h-10"
              type="text"
              placeholder="Nội dung "
              v-model="tagsNameOneTime"
            />
          </div>
          <!-- Chọn học liệu  -->
          <div class="w-full">
            <p class="my-4 text-base font-bold">2.Chọn học liệu</p>
            <div class="flex w-full px-0.5">
              <div class="w-1/2 pr-2">
                <p class="mb-1 text-sm font-bold">Chọn Chương trình</p>
                <multiselect
                  v-model="program"
                  :searchable="searchable"
                  :options="programs"
                  valueProp="ID"
                  track-by="Name"
                  label="Name"
                  placeholder="Tìm kiếm"
                ></multiselect>
              </div>
              <div class="w-1/2 pl-2">
                <p class="mb-1 text-sm font-bold">Chọn Cấp độ</p>
                <multiselect
                  v-model="level"
                  :searchable="searchable"
                  :options="levelsFilter"
                  valueProp="ID"
                  track-by="Name"
                  label="Name"
                  placeholder="Tìm kiếm"
                ></multiselect>
              </div>
            </div>
          </div>
          <div v-if="isFilterCourse">
            <!-- Course  -->
            <div class="flex mt-6">
              <button
                @click="showSelectedSentence = false"
                :class="
                  !showSelectedSentence
                    ? '!border-b-2 !border-blue-500 text-blue-500'
                    : ''
                "
                class="text-sm border-b pb-3 pr-2 outline-none"
              >
                Câu hỏi từ học liệu
              </button>
              <button
                @click="showSelectedSentence = true"
                :class="
                  showSelectedSentence
                    ? '!border-b-2 !border-blue-500 text-blue-500'
                    : ''
                "
                class="text-sm border-b pb-3 pl-2 outline-none"
              >
                Câu đã chọn ({{ currentSelectedQuestion.length }})
              </button>
            </div>
            <!-- Part 1  -->

            <div v-show="!showSelectedSentence" class="mt-6">
              <div v-for="course in courses" :key="course.ID">
                <p
                  class="font-semibold ml-2 text-green-400 mb-4 flex items-center cursor-pointer"
                  @click="toggleCourse(course.ID)"
                >
                  {{ course.Name }}
                  <span
                    ><img
                      class="w-5 h-5"
                      :src="ArrowDownCircle"
                      alt=""
                      srcset=""
                  /></span>
                </p>
                <div class="hidden" :id="`course-${course.ID}`">
                  <UnitVue
                    v-for="unit in filterChapters(course.ID, '0')"
                    :key="unit.ID"
                    :unit="unit"
                    :courseID="course.ID"
                  />
                </div>
              </div>
            </div>
            <!-- Part 2  -->
            <div v-if="showSelectedSentence">
              <div class="list-question mt-4">
                <selectedQuestion
                  v-for="(question, index) in currentSelectedQuestion"
                  :key="question.ID"
                  :questionPart="question"
                  :index="index"
                  class="border"
                />
              </div>
            </div>
          </div>
          <div class="mt-4 text-red-500" v-if="!isLoading && !isFilterCourse">
            Không có dữ liệu
          </div>
        </div>
      </div>

      <div class="absolute bottom-4 right-4">
        <button
          @click="cancelAction()"
          class="button bg-white text-red-500 border border-gray-300 mr-3 w-15"
        >
          Huỷ
        </button>
        <button
          :disabled="currentSelectedQuestion.length == 0"
          @click="saveData()"
          class="button w-15 button-primary"
        >
          Lưu
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import closeIcon from "../../assets/image/close-icon.svg";
import { usePopupStore } from "@/stores/popup";
import arrowTop from "../../assets/image/arrow-top.svg";
import arrowDown from "../../assets/image/arrow-down.svg";
import folderIcon from "../../assets/image/folder.svg";
import ArrowDownCircle from "../../assets/image/arrow-down-circle.svg";
import UnitVue from "../unit/unit.vue";
import Multiselect from "@vueform/multiselect";
import { useSelectQuestionStore } from "../../stores/question-select-flow-store";
import { storeToRefs } from "pinia";
import selectedQuestion from "../question/selectedQuestion/questionSelected.vue";
import { useQuestionBankStore } from "@/stores/question-bank-store";
import Program from "../../type/program";
import Level from "../../type/level";

export default defineComponent({
  name: "SelectQuestionFromCourse",
  components: {
    UnitVue,
    Multiselect,
    selectedQuestion,
  },
  setup() {
    const { updateSelectQuestionFromCourseStatus } = usePopupStore();
    const { isLoading } = storeToRefs(usePopupStore());
    const { getCourseData } = useSelectQuestionStore();
    const { addQuestionToCurrentList } = useQuestionBankStore();
    const { arrayAddnew } = storeToRefs(useQuestionBankStore());
    const {
      courses,
      isFillDesOnetime,
      tagsNameOneTime,
      chapters,
      listLessons,
      listLessonParts,
    } = storeToRefs(useSelectQuestionStore());
    const { currentSelectedQuestion } = storeToRefs(useSelectQuestionStore());
    const selectedOption = ref("onetime");
    const showSelectedSentence = ref(false);
    const isFilterCourse = ref(false);
    const program = ref("");
    const searchable = ref(true);
    const programs = ref<Program[]>([]);
    const levels = ref<Level[]>([]);
    const level = ref("");

    const cancelAction = () => {
      currentSelectedQuestion.value = [];
      updateSelectQuestionFromCourseStatus(false);
      tagsNameOneTime.value = "";
    };
    const saveData = () => {
      addQuestionToCurrentList(currentSelectedQuestion.value);
      arrayAddnew.value = [
        ...arrayAddnew.value,
        ...currentSelectedQuestion.value,
      ];
      currentSelectedQuestion.value = [];
      updateSelectQuestionFromCourseStatus(false);
      tagsNameOneTime.value = "";
    };
    const filterChapters = (courseID: string, ParentID: string) => {
      if (courseID != undefined) {
        const data = chapters.value.filter(
          (x) => x.CourseID == courseID && x.ParentID == ParentID
        );
        if (data.length == 0) {
          return [];
        } else {
          return data;
        }
      } else {
        return [];
      }
    };

    const toggleCourse = (id: string) => {
      const currentElement = document.getElementById(`course-${id}`);
      if (currentElement) {
        currentElement.classList.toggle("hidden");
      }
    };
    watch([courses], () => {
      if (courses.value.length > 0) {
        isFilterCourse.value = true;
      } else {
        isFilterCourse.value = false;
      }
    });
    watch(selectedOption, () => {
      if (selectedOption.value == "eachsentence") {
        isFillDesOnetime.value = false;
        tagsNameOneTime.value = "";
      } else {
        isFillDesOnetime.value = true;
      }
    });
    watch(program, () => {
      level.value = "";
    });
    const levelsFilter = computed(() => {
      if (program.value != "") {
        return levels.value.filter((level) => level.SubjectID == program.value);
      } else {
        return [];
      }
    });
    onMounted(() => {
      // getCourseData();
      programs.value = [
        {
          OriginID: null,
          Name: "Cambridge",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-11-27T07:33:49.62Z",
          Updated: "2021-05-21T11:50:57.89Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [0, 1, 2, 3, 4],
          ID: "5fc0abdd107ea728b4823937",
        },
        {
          OriginID: null,
          Name: "Chương trình chung",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-10-12T08:24:30.437Z",
          Updated: "2021-05-21T11:50:38.41Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [0, 1, 2, 3, 4],
          ID: "5f8412be72946a2684e3d87a",
        },
        {
          OriginID: null,
          Name: "Giao tiếp",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-11-27T07:33:37.258Z",
          Updated: "2021-05-21T11:50:50.476Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [0, 1, 2, 3, 4],
          ID: "5fc0abd1107ea728b4823935",
        },
        {
          OriginID: null,
          Name: "IELTS",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2019-09-18T01:22:17.122Z",
          Updated: "2021-05-21T11:47:48.465Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [0, 1, 2, 3, 4],
          ID: "5d8186c9a8e01e0f3c96d9b3",
        },
        {
          OriginID: null,
          Name: "Khác",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-11-27T07:34:21.256Z",
          Updated: "2021-05-21T11:51:04.042Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [0, 1, 2, 3, 4],
          ID: "5fc0abfd107ea728b4823945",
        },
        {
          OriginID: null,
          Name: "Ngữ pháp",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-11-27T09:40:35.958Z",
          Updated: "2021-05-21T11:51:16.948Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [0, 1, 2, 3, 4],
          ID: "5fc0c993107ea728b4824505",
        },
        {
          OriginID: null,
          Name: "THCS",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-06-09T02:02:00.682Z",
          Updated: "2021-05-21T11:50:25.771Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [1],
          ID: "5edeed982bbb7e0da4568165",
        },
        {
          OriginID: null,
          Name: "THPT",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-06-24T03:41:08.481Z",
          Updated: "2021-05-21T11:50:30.85Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [2],
          ID: "5ef2cb54202f7b26544032e4",
        },
        {
          OriginID: null,
          Name: "TOEFL",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-11-27T09:32:24.547Z",
          Updated: "2021-05-21T11:51:10.651Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [0, 1, 2, 3, 4],
          ID: "5fc0c7a8107ea728b48244a8",
        },
        {
          OriginID: null,
          Name: "TOEIC",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-05-23T01:52:19.022Z",
          Updated: "2021-05-21T11:50:13.682Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [0, 1, 2, 3, 4],
          ID: "5ec881d3a7cf090694a65517",
        },
        {
          OriginID: null,
          Name: "Tiểu học",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-03-11T03:18:20.018Z",
          Updated: "2021-05-21T11:50:05.699Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [0],
          ID: "5e68587c53f85c27582d1829",
        },
        {
          OriginID: null,
          Name: "Từ vựng",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-11-27T09:40:45.222Z",
          Updated: "2021-05-21T11:51:23.682Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [0, 1, 2, 3, 4],
          ID: "5fc0c99d107ea728b4824508",
        },
        {
          OriginID: null,
          Name: "UTC",
          Code: null,
          ParentID: null,
          CreateUser: null,
          Created: "2020-03-08T08:30:50.688Z",
          Updated: "2021-05-21T11:50:00.802Z",
          IsAdmin: false,
          IsActive: true,
          MainSubjectID: "6073df26c549a13e4c631636",
          Order: 0,
          EducationLevels: [3],
          ID: "5e64ad3aea405f11b4aabaac",
        },
      ];
      levels.value = [
        {
          OriginID: null,
          Name: "Band 5.0+",
          Code: null,
          SubjectID: "5d8186c9a8e01e0f3c96d9b3",
          ParentID: "0",
          CreateUser: null,
          Created: "2019-09-26T09:40:21.683Z",
          Updated: "2019-09-26T09:40:21.683Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5d8c8785a2dba730482f5860",
        },
        {
          OriginID: null,
          Name: "Band 6.0+",
          Code: null,
          SubjectID: "5d8186c9a8e01e0f3c96d9b3",
          ParentID: "0",
          CreateUser: null,
          Created: "2019-09-26T09:40:30.034Z",
          Updated: "2019-09-26T09:40:30.034Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5d8c878ea2dba730482f5861",
        },
        {
          OriginID: null,
          Name: "Band 4.0+",
          Code: null,
          SubjectID: "5d8186c9a8e01e0f3c96d9b3",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-08-27T01:58:09.894Z",
          Updated: "2020-08-27T01:58:09.894Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5f47133106991f1da0ab3414",
        },
        {
          OriginID: null,
          Name: "Band 7.0+",
          Code: null,
          SubjectID: "5d8186c9a8e01e0f3c96d9b3",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-08-27T01:58:19.685Z",
          Updated: "2020-08-27T01:58:19.685Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5f47133b06991f1da0ab3415",
        },
        {
          OriginID: null,
          Name: "0 - 3.5",
          Code: null,
          SubjectID: "5d8186c9a8e01e0f3c96d9b3",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:36:41.831Z",
          Updated: "2020-11-27T07:36:53.192Z",
          IsAdmin: false,
          IsActive: false,
          Order: 0,
          ID: "5fc0ac89107ea728b4823978",
        },
        {
          OriginID: null,
          Name: "5 - 6.5",
          Code: null,
          SubjectID: "5d8186c9a8e01e0f3c96d9b3",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:37:16.864Z",
          Updated: "2020-11-27T07:37:16.864Z",
          IsAdmin: false,
          IsActive: false,
          Order: 0,
          ID: "5fc0acac107ea728b482397d",
        },
        {
          OriginID: null,
          Name: "3.5 - 5",
          Code: null,
          SubjectID: "5d8186c9a8e01e0f3c96d9b3",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:37:04.688Z",
          Updated: "2020-11-27T07:37:04.688Z",
          IsAdmin: false,
          IsActive: false,
          Order: 0,
          ID: "5fc0aca0107ea728b482397c",
        },
        {
          OriginID: null,
          Name: "6.5+",
          Code: null,
          SubjectID: "5d8186c9a8e01e0f3c96d9b3",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:37:25.966Z",
          Updated: "2020-11-27T07:37:34.04Z",
          IsAdmin: false,
          IsActive: false,
          Order: 0,
          ID: "5fc0acb5107ea728b482397e",
        },
        {
          OriginID: null,
          Name: "Bộ đề",
          Code: null,
          SubjectID: "5d8186c9a8e01e0f3c96d9b3",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:37:42.981Z",
          Updated: "2020-11-27T07:37:42.981Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0acc6107ea728b4823983",
        },
        {
          OriginID: null,
          Name: "Cơ bản",
          Code: null,
          SubjectID: "5e64ad3aea405f11b4aabaac",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-03-08T10:39:50.292Z",
          Updated: "2020-03-08T10:39:50.292Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5e64cb763806d312b43f1f47",
        },
        {
          OriginID: null,
          Name: "Nâng cao",
          Code: null,
          SubjectID: "5e64ad3aea405f11b4aabaac",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-03-08T10:40:01.689Z",
          Updated: "2020-03-08T10:40:01.689Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5e64cb813806d312b43f1f48",
        },
        {
          OriginID: null,
          Name: "Lớp 1",
          Code: null,
          SubjectID: "5e68587c53f85c27582d1829",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-07-07T08:33:22.709Z",
          Updated: "2020-07-07T08:33:22.709Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5f043352535d9d2e903df765",
        },
        {
          OriginID: null,
          Name: "Lớp 2",
          Code: null,
          SubjectID: "5e68587c53f85c27582d1829",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-07-07T08:33:32.782Z",
          Updated: "2020-07-07T08:33:32.782Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5f04335c535d9d2e903df766",
        },
        {
          OriginID: null,
          Name: "Lớp 3",
          Code: null,
          SubjectID: "5e68587c53f85c27582d1829",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-07-07T08:33:41.867Z",
          Updated: "2020-07-07T08:33:41.867Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5f043365535d9d2e903df767",
        },
        {
          OriginID: null,
          Name: "Lớp 4",
          Code: null,
          SubjectID: "5e68587c53f85c27582d1829",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-07-07T08:33:51.115Z",
          Updated: "2020-07-07T08:33:51.115Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5f04336f535d9d2e903df768",
        },
        {
          OriginID: null,
          Name: "Lớp 5",
          Code: null,
          SubjectID: "5e68587c53f85c27582d1829",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-07-07T08:34:00.786Z",
          Updated: "2020-07-07T08:34:00.786Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5f043378535d9d2e903df769",
        },
        {
          OriginID: null,
          Name: "Chung",
          Code: null,
          SubjectID: "5e68587c53f85c27582d1829",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:42:25.793Z",
          Updated: "2020-11-27T07:42:25.793Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0ade1107ea728b48239d5",
        },
        {
          OriginID: null,
          Name: "450+",
          Code: null,
          SubjectID: "5ec881d3a7cf090694a65517",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-05-23T01:52:57.453Z",
          Updated: "2020-05-23T01:52:57.453Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ec881f9a7cf090694a65519",
        },
        {
          OriginID: null,
          Name: "General Knowledge",
          Code: null,
          SubjectID: "5ec881d3a7cf090694a65517",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-06-01T14:05:18.645Z",
          Updated: "2020-06-01T14:05:18.645Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ed50b1ec8a620255cc73bff",
        },
        {
          OriginID: null,
          Name: "TOEIC FOCUS",
          Code: null,
          SubjectID: "5ec881d3a7cf090694a65517",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-06-01T14:05:33.111Z",
          Updated: "2020-06-01T14:05:33.111Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ed50b2dc8a620255cc73c00",
        },
        {
          OriginID: null,
          Name: "0 - 200",
          Code: null,
          SubjectID: "5ec881d3a7cf090694a65517",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:40:16.238Z",
          Updated: "2020-11-27T07:40:16.238Z",
          IsAdmin: false,
          IsActive: false,
          Order: 0,
          ID: "5fc0ad60107ea728b48239c0",
        },
        {
          OriginID: null,
          Name: "350 - 500",
          Code: null,
          SubjectID: "5ec881d3a7cf090694a65517",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:40:40.702Z",
          Updated: "2020-11-27T07:40:40.702Z",
          IsAdmin: false,
          IsActive: false,
          Order: 0,
          ID: "5fc0ad78107ea728b48239c2",
        },
        {
          OriginID: null,
          Name: "300+",
          Code: null,
          SubjectID: "5ec881d3a7cf090694a65517",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-05-23T01:52:47.198Z",
          Updated: "2020-05-23T01:52:47.198Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ec881efa7cf090694a65518",
        },
        {
          OriginID: null,
          Name: "650+",
          Code: null,
          SubjectID: "5ec881d3a7cf090694a65517",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-05-23T01:53:10.318Z",
          Updated: "2020-05-23T01:53:10.318Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ec88206a7cf090694a6551a",
        },
        {
          OriginID: null,
          Name: "200 - 350",
          Code: null,
          SubjectID: "5ec881d3a7cf090694a65517",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:40:27.612Z",
          Updated: "2020-11-27T07:40:27.612Z",
          IsAdmin: false,
          IsActive: false,
          Order: 0,
          ID: "5fc0ad6b107ea728b48239c1",
        },
        {
          OriginID: null,
          Name: "500 - 650",
          Code: null,
          SubjectID: "5ec881d3a7cf090694a65517",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:40:59.895Z",
          Updated: "2020-11-27T07:40:59.895Z",
          IsAdmin: false,
          IsActive: false,
          Order: 0,
          ID: "5fc0ad8b107ea728b48239c8",
        },
        {
          OriginID: null,
          Name: "Bộ đề",
          Code: null,
          SubjectID: "5ec881d3a7cf090694a65517",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:41:09.116Z",
          Updated: "2020-11-27T07:41:09.116Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0ad95107ea728b48239ca",
        },
        {
          OriginID: null,
          Name: "Khối 6",
          Code: null,
          SubjectID: "5edeed982bbb7e0da4568165",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-06-24T03:37:13.45Z",
          Updated: "2020-06-24T03:37:13.45Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ef2ca69202f7b26544032d7",
        },
        {
          OriginID: null,
          Name: "Khối 7",
          Code: null,
          SubjectID: "5edeed982bbb7e0da4568165",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-06-24T03:37:55.676Z",
          Updated: "2020-06-24T03:37:55.676Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ef2ca93202f7b26544032d8",
        },
        {
          OriginID: null,
          Name: "Khối 8",
          Code: null,
          SubjectID: "5edeed982bbb7e0da4568165",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-06-24T03:38:07.364Z",
          Updated: "2020-06-24T03:38:07.364Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ef2ca9f202f7b26544032d9",
        },
        {
          OriginID: null,
          Name: "Khối 9",
          Code: null,
          SubjectID: "5edeed982bbb7e0da4568165",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-06-24T03:38:26.065Z",
          Updated: "2020-06-24T03:38:26.065Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ef2cab2202f7b26544032db",
        },
        {
          OriginID: null,
          Name: "Chung",
          Code: null,
          SubjectID: "5edeed982bbb7e0da4568165",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-10-12T08:10:40.851Z",
          Updated: "2020-11-27T07:42:06.623Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5f840f8072946a2684e3d6dd",
        },
        {
          OriginID: null,
          Name: "Khối 10",
          Code: null,
          SubjectID: "5ef2cb54202f7b26544032e4",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-06-24T03:41:27.289Z",
          Updated: "2020-06-24T03:41:27.289Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ef2cb67202f7b26544032e5",
        },
        {
          OriginID: null,
          Name: "Khối 11",
          Code: null,
          SubjectID: "5ef2cb54202f7b26544032e4",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-06-24T03:41:36.845Z",
          Updated: "2020-06-24T03:41:36.845Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ef2cb70202f7b26544032e6",
        },
        {
          OriginID: null,
          Name: "Khối 12",
          Code: null,
          SubjectID: "5ef2cb54202f7b26544032e4",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-06-24T03:41:45.688Z",
          Updated: "2020-06-24T03:41:45.687Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5ef2cb79202f7b26544032e7",
        },
        {
          OriginID: null,
          Name: "Chung",
          Code: null,
          SubjectID: "5ef2cb54202f7b26544032e4",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-10-12T08:10:56.14Z",
          Updated: "2020-11-27T07:41:53.948Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5f840f9072946a2684e3d6e1",
        },
        {
          OriginID: null,
          Name: "General",
          Code: null,
          SubjectID: "5f8412be72946a2684e3d87a",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-10-12T08:24:49.277Z",
          Updated: "2020-10-12T08:24:49.277Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5f8412d172946a2684e3d87d",
        },
        {
          OriginID: null,
          Name: "A1",
          Code: null,
          SubjectID: "5fc0abd1107ea728b4823935",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:25:22.372Z",
          Updated: "2020-11-27T09:25:22.372Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c602107ea728b48243e9",
        },
        {
          OriginID: null,
          Name: "B1",
          Code: null,
          SubjectID: "5fc0abd1107ea728b4823935",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:25:35.624Z",
          Updated: "2020-11-27T09:25:35.624Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c60f107ea728b48243f6",
        },
        {
          OriginID: null,
          Name: "C1",
          Code: null,
          SubjectID: "5fc0abd1107ea728b4823935",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:25:47.985Z",
          Updated: "2020-11-27T09:25:47.985Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c61b107ea728b48243ff",
        },
        {
          OriginID: null,
          Name: "A2",
          Code: null,
          SubjectID: "5fc0abd1107ea728b4823935",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:25:29.258Z",
          Updated: "2020-11-27T09:25:29.258Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c609107ea728b48243ed",
        },
        {
          OriginID: null,
          Name: "B2",
          Code: null,
          SubjectID: "5fc0abd1107ea728b4823935",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:25:41.996Z",
          Updated: "2020-11-27T09:25:41.996Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c615107ea728b48243f9",
        },
        {
          OriginID: null,
          Name: "A1",
          Code: null,
          SubjectID: "5fc0abdd107ea728b4823937",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:38:55.145Z",
          Updated: "2020-11-27T07:38:55.145Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0ad0f107ea728b482398a",
        },
        {
          OriginID: null,
          Name: "A2",
          Code: null,
          SubjectID: "5fc0abdd107ea728b4823937",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:39:12.201Z",
          Updated: "2020-11-27T07:39:12.201Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0ad20107ea728b4823990",
        },
        {
          OriginID: null,
          Name: "B1",
          Code: null,
          SubjectID: "5fc0abdd107ea728b4823937",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:39:25.016Z",
          Updated: "2020-11-27T07:39:25.016Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0ad2d107ea728b482399b",
        },
        {
          OriginID: null,
          Name: "B2",
          Code: null,
          SubjectID: "5fc0abdd107ea728b4823937",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:39:36.638Z",
          Updated: "2020-11-27T07:39:36.638Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0ad38107ea728b48239a3",
        },
        {
          OriginID: null,
          Name: "C1",
          Code: null,
          SubjectID: "5fc0abdd107ea728b4823937",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:39:43.267Z",
          Updated: "2020-11-27T07:39:43.267Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0ad3f107ea728b48239ae",
        },
        {
          OriginID: null,
          Name: "Chung",
          Code: null,
          SubjectID: "5fc0abfd107ea728b4823945",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T07:44:07.283Z",
          Updated: "2020-11-27T07:44:07.283Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0ae47107ea728b48239e6",
        },
        {
          OriginID: null,
          Name: "iBT",
          Code: null,
          SubjectID: "5fc0c7a8107ea728b48244a8",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:33:15.379Z",
          Updated: "2020-11-27T09:33:15.379Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c7db107ea728b48244ad",
        },
        {
          OriginID: null,
          Name: "ITP",
          Code: null,
          SubjectID: "5fc0c7a8107ea728b48244a8",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:33:31.682Z",
          Updated: "2020-11-27T09:33:31.682Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c7eb107ea728b48244b2",
        },
        {
          OriginID: null,
          Name: "Primary",
          Code: null,
          SubjectID: "5fc0c7a8107ea728b48244a8",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:33:51.115Z",
          Updated: "2020-11-27T09:33:51.115Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c7ff107ea728b48244b4",
        },
        {
          OriginID: null,
          Name: "Junior",
          Code: null,
          SubjectID: "5fc0c7a8107ea728b48244a8",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:33:42.266Z",
          Updated: "2020-11-27T09:33:42.266Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c7f6107ea728b48244b3",
        },
        {
          OriginID: null,
          Name: "Chung",
          Code: null,
          SubjectID: "5fc0c993107ea728b4824505",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:40:59.783Z",
          Updated: "2020-11-27T09:40:59.783Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c9ab107ea728b4824509",
        },
        {
          OriginID: null,
          Name: "Chung",
          Code: null,
          SubjectID: "5fc0c99d107ea728b4824508",
          ParentID: "0",
          CreateUser: null,
          Created: "2020-11-27T09:41:09.205Z",
          Updated: "2020-11-27T09:41:09.205Z",
          IsAdmin: false,
          IsActive: true,
          Order: 0,
          ID: "5fc0c9b5107ea728b482450c",
        },
      ];
    });
    watch(level, () => {
      getCourseData(program.value, level.value);
    });
    watch([tagsNameOneTime, isFillDesOnetime], () => {
      if (isFillDesOnetime) {
        currentSelectedQuestion.value = currentSelectedQuestion.value.map(
          (question) => {
            return { ...question, TagsName: tagsNameOneTime.value };
          }
        );
      }
    });
    return {
      closeIcon,
      selectedOption,
      showSelectedSentence,
      arrowDown,
      ArrowDownCircle,
      arrowTop,
      folderIcon,
      programs,
      program,
      searchable,
      levels,
      level,
      levelsFilter,
      isFilterCourse,
      courses,
      currentSelectedQuestion,
      isFillDesOnetime,
      tagsNameOneTime,
      listLessons,
      listLessonParts,
      isLoading,
      chapters,
      cancelAction,
      saveData,
      updateSelectQuestionFromCourseStatus,
      filterChapters,
      toggleCourse,
    };
  },
});
</script>
<style>
.select-question-from-course {
  width: 100%;
}
.select-custom-modal-content {
  max-height: calc(100vh - 80px);
}
.select-question-from-course .multiselect {
  border: var(--ms-border-width, 1px) solid var(--ms-border-color, #d1d5db) !important;
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>
