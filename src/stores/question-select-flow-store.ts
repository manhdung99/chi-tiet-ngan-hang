import axios from "axios";
import { defineStore } from "pinia";
import PartQuestion from "../type/partQuestion";
import Lesson from "../type/lesson";
import { generateRandomHexId } from "../uses/function";
import { usePopupStore } from "./popup";
import Unit from "../type/unit";
export const useSelectQuestionStore = defineStore("selectQuestionStore", {
  state: () => ({
    courses: [] as Array<any>,
    currentSelectedQuestion: [] as Array<any>,
    isFillDesOnetime: true,
    descriptionOneTime: "",
    chapters: [] as Array<any>,
    listLessons: [] as Array<Lesson>,
    listLessonParts: [] as PartQuestion[],
  }),
  getters: {},
  actions: {
    getCourseData(subject: string, level: string) {
      const popUp = usePopupStore();

      const _form = new FormData();
      _form.append("GradeID", level);
      _form.append("SubjectID", subject);
      const _url =
        "https://alpha.eduso.vn/eduso/teacher/Curriculum/GetListCourse";
      popUp.isLoading = true;
      axios
        .post(_url, _form, {
          withCredentials: true,
        })
        .then((response) => {
          popUp.isLoading = false;
          const data = response.data.Courses;
          let chaptersData = response.data.Chapters;
          //debugger
          if (data.length > 0) {
            chaptersData = chaptersData.map((chapter: Unit) => {
              return { ...chapter, Lessons: null };
            });
            this.courses = data;
            this.chapters = chaptersData;
          }
          //else if (error == "") {
          //    alert(error)
          //}
        })
        .catch((e) => {
          popUp.isLoading = false;
          alert("Error: " + e);
        });
    },
    deleteSelectedQuestion(id: string) {
      this.currentSelectedQuestion = this.currentSelectedQuestion.filter(
        (question) => question.ID != id
      );
    },
    duplicateSelectedQuestion(id: string) {
      const currentDuplicateQuestion = this.currentSelectedQuestion.find(
        (question) => question.ID == id
      );
      const newID = generateRandomHexId();
      const newQuestion = { ...currentDuplicateQuestion, ID: newID };
      this.currentSelectedQuestion = [
        newQuestion,
        ...this.currentSelectedQuestion,
      ];
    },
    async loadLesson(chapterID: string) {
      const _form = new FormData();
      const _url =
        "https://alpha.eduso.vn/eduso/teacher/Curriculum/GetListCourseLesson";
      _form.append("ParentID", chapterID);
      await axios
        .post(_url, _form, {
          withCredentials: true,
        })
        .then((response) => {
          const stt = response.data.Status;
          if (stt) {
            this.listLessons = response.data.CourseLessons;
            this.listLessonParts = response.data.LessonParts;
          } else {
            alert(response.data.Msg);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
});
