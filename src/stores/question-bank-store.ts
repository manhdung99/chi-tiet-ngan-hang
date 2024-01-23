import Bank from "../type/bank";
import { defineStore } from "pinia";
import { usePopupStore } from "./popup";
import PartQuestion from "../type/partQuestion";
import axios from "axios";
import { generateRandomHexId } from "../uses/function";
import { flattenObject } from "../uses/convertData";
export const useQuestionBankStore = defineStore("questionBankStore", {
  state: () => ({
    questionBanks: [] as Array<any>,
    currentBankQuestions: [] as Array<PartQuestion>,
    questionDeleteID: "",
    questionDeleteIndex: 0,
    questionDuplicateID: "",
    questionDuplicateIndex: 0,
    subjectID: "",
    bankID: "",
    listBankQuestion: [] as Array<Bank>,
    currentbankName: "",
    arrayAddnew: [] as Array<PartQuestion>,
    arrayUpdate: [] as Array<PartQuestion>,
    arrayDelete: [] as Array<string>,
  }),
  getters: {},
  actions: {
    async getBankArchive(searchText = ""): Promise<void> {
      const popup = usePopupStore();
      popup.isLoading = true;
      const url =
        process.env.VUE_APP_BASE_URL +
        process.env.VUE_APP_GET_LIST_QUESTION_ARCHIVE;
      const params = new FormData();
      if (this.subjectID == "") {
        params.append("MainSubjectID", "6073df26c549a13e4c631636");
      } else {
        params.append("MainSubjectID", this.subjectID);
      }
      if (searchText != "") {
        params.append("SearchText", searchText);
      }
      const response = await axios.post(url, params, {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI1ZDgwOGUyZWNmOWE4MjFiZGM5ZGFmODEiLCJlbWFpbCI6InZpZXRwaHVuZy5pdEBnbWFpbC5jb20iLCJ1bmlxdWVfbmFtZSI6IlBodW5nIER1YyBWaWV0Iiwicm9sZSI6InRlYWNoZXIiLCJUeXBlIjoidGVhY2hlciIsIkNoZWNrIjoiWmRQNEVqIiwibmJmIjoxNzA1NjU2MzU0LCJleHAiOjE3MzcyNzg3NTQsImlhdCI6MTcwNTY1NjM1NH0.m4eJjNsUUEJm9WNiEqicnjrrLW8a8h9qYyRX6At1FQs`,
        },
      });
      if (response) {
        this.listBankQuestion = response.data.Data;
      }

      popup.isLoading = false;
    },
    duplicateBank(bank: Bank) {
      const newID = generateRandomHexId();
      const newBank = {
        ...bank,
        ID: newID,
      } as Bank;
      this.listBankQuestion = [newBank, ...this.listBankQuestion];
    },
    deleteBank(bank: Bank) {
      this.listBankQuestion = this.listBankQuestion.filter((data) => {
        data.ID == bank.ID;
      });
    },
    async getCurrentBankQuestions(id: string, searchText = "", LevelPart = "") {
      const popUp = usePopupStore();
      popUp.isLoading = true;
      if (id && id.length > 0) {
        const url =
          process.env.VUE_APP_BASE_URL +
          process.env.VUE_APP_GET_LIST_PART_EXAMMANAGER;
        const params = new FormData();
        params.append("ID", id);
        params.append("PageSize", "1000");
        const response = await axios.post(url, params, {
          headers: {
            Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI1ZDgwOGUyZWNmOWE4MjFiZGM5ZGFmODEiLCJlbWFpbCI6InZpZXRwaHVuZy5pdEBnbWFpbC5jb20iLCJ1bmlxdWVfbmFtZSI6IlBodW5nIER1YyBWaWV0Iiwicm9sZSI6InRlYWNoZXIiLCJUeXBlIjoidGVhY2hlciIsIkNoZWNrIjoiWmRQNEVqIiwibmJmIjoxNzA1NjU2MzU0LCJleHAiOjE3MzcyNzg3NTQsImlhdCI6MTcwNTY1NjM1NH0.m4eJjNsUUEJm9WNiEqicnjrrLW8a8h9qYyRX6At1FQs`,
          },
        });
        if (response) {
          this.currentBankQuestions = response.data.Data;
          this.currentBankQuestions = this.currentBankQuestions.map((part) => {
            let tagName = "";
            part.ListTags?.forEach((data, index) => {
              if (index > 0) {
                tagName = tagName + "-";
              }
              tagName = tagName + data.name;
            });
            return { ...part, TagsName: tagName };
          });
        }
      } else {
        this.currentBankQuestions = [];
      }
      popUp.isLoading = false;
    },
    addQuestionToCurrentList(data: Array<PartQuestion>) {
      this.currentBankQuestions = [...data, ...this.currentBankQuestions];
    },
    deleteQuestion(id: string) {
      this.currentBankQuestions = this.currentBankQuestions.filter(
        (question) => question.ID != id
      );
    },
    duplicateQuestion(id: string) {
      const currentDuplicateQuestion = this.currentBankQuestions.find(
        (question) => question.ID == id
      );
      const newID = generateRandomHexId();
      const newQuestion = {
        ...currentDuplicateQuestion,
        ID: newID,
      } as PartQuestion;
      this.currentBankQuestions = [newQuestion, ...this.currentBankQuestions];
    },
    updateQuestionInQuestionList(data: PartQuestion) {
      const index = this.currentBankQuestions.findIndex(
        (question) => question.ID == data.ID
      );
      if (index >= 0) {
        const bankQuestions = [...this.currentBankQuestions];
        bankQuestions[index] = data;
        this.currentBankQuestions = [...bankQuestions];
      }
    },
    updateSubjectID(id: string) {
      this.subjectID = id;
    },
    updateBankName(text: string) {
      localStorage.setItem("bankName", text);
    },
    async addOrUpdateBank(
      bankID: string,
      currentbankName: string,
      subjectID: string,
      addnewArray: Array<PartQuestion>,
      arrayUpdate: Array<PartQuestion>,
      arrayDelete: Array<string>
    ) {
      const popup = usePopupStore();
      popup.isLoading = true;
      const url =
        process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SAVE_BANK_DATA;
      const formData = new FormData();
      formData.append("ID", bankID);
      formData.append("Name", currentbankName);
      formData.append("MainSubjectID", subjectID);

      addnewArray.forEach((obj: any, index: number) => {
        flattenObject(formData, obj, `createList[${index}]`);
      });
      arrayUpdate.forEach((obj: any, index: number) => {
        flattenObject(formData, obj, `updateList[${index}]`);
      });
      arrayDelete.forEach((value: string, index: number) => {
        formData.append(`deleteList[${index}]`, value);
      });

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI1ZDgwOGUyZWNmOWE4MjFiZGM5ZGFmODEiLCJlbWFpbCI6InZpZXRwaHVuZy5pdEBnbWFpbC5jb20iLCJ1bmlxdWVfbmFtZSI6IlBodW5nIER1YyBWaWV0Iiwicm9sZSI6InRlYWNoZXIiLCJUeXBlIjoidGVhY2hlciIsIkNoZWNrIjoiWmRQNEVqIiwibmJmIjoxNzA1NjU2MzU0LCJleHAiOjE3MzcyNzg3NTQsImlhdCI6MTcwNTY1NjM1NH0.m4eJjNsUUEJm9WNiEqicnjrrLW8a8h9qYyRX6At1FQs`,
        },
      });
      if (response.data.Code == 200) {
        this.arrayAddnew = [];
        this.arrayUpdate = [];
        this.arrayAddnew = [];
        popup.openAddnewSuccess = true;
        this.bankID = response.data.Data.storeID;
      } else {
        alert("Có lỗi xảy ra trong quá trình lưu ngân hàng");
      }
      popup.isLoading = false;
    },
    async removeBankByID(id: string) {
      const url =
        process.env.VUE_APP_BASE_URL + process.env.VUE_APP_REMOVE_BANK;
      const formData = new FormData();
      formData.append("IDs", id);
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI1ZDgwOGUyZWNmOWE4MjFiZGM5ZGFmODEiLCJlbWFpbCI6InZpZXRwaHVuZy5pdEBnbWFpbC5jb20iLCJ1bmlxdWVfbmFtZSI6IlBodW5nIER1YyBWaWV0Iiwicm9sZSI6InRlYWNoZXIiLCJUeXBlIjoidGVhY2hlciIsIkNoZWNrIjoiWmRQNEVqIiwibmJmIjoxNzA1NjU2MzU0LCJleHAiOjE3MzcyNzg3NTQsImlhdCI6MTcwNTY1NjM1NH0.m4eJjNsUUEJm9WNiEqicnjrrLW8a8h9qYyRX6At1FQs`,
        },
      });
      if (response) {
        console.log(response);
      }
    },
  },
});
