import PartQuestion from "../type/partQuestion";
import axios from "axios";
import { defineStore } from "pinia";
import { useQuestionBankStore } from "./question-bank-store";
import { usePopupStore } from "./popup";
import Bank from "../type/bank";
import Tag from "@/type/tag";
export const useSelectQuestionFromBank = defineStore("selectQuestionFromBank", {
  state: () => ({
    bankList: [] as Array<Bank>,
  }),
  getters: {},
  actions: {
    async getBanks(): Promise<void> {
      const popup = usePopupStore();
      popup.isLoading = true;
      const { subjectID } = useQuestionBankStore();
      const url =
        process.env.VUE_APP_BASE_URL +
        process.env.VUE_APP_GET_LIST_QUESTION_BANK;
      const params = new FormData();
      if (subjectID == "") {
        params.append("MainSubjectID", "6073df26c549a13e4c631636");
      } else {
        params.append("MainSubjectID", subjectID);
      }
      const response = await axios.post(url, params, {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI1ZDgwOGUyZWNmOWE4MjFiZGM5ZGFmODEiLCJlbWFpbCI6InZpZXRwaHVuZy5pdEBnbWFpbC5jb20iLCJ1bmlxdWVfbmFtZSI6IlBodW5nIER1YyBWaWV0Iiwicm9sZSI6InRlYWNoZXIiLCJUeXBlIjoidGVhY2hlciIsIkNoZWNrIjoiWmRQNEVqIiwibmJmIjoxNzA1NjU2MzU0LCJleHAiOjE3MzcyNzg3NTQsImlhdCI6MTcwNTY1NjM1NH0.m4eJjNsUUEJm9WNiEqicnjrrLW8a8h9qYyRX6At1FQs`,
        },
      });
      if (response.data.StatusCode == 1) {
        this.bankList = response.data.Data;
      }

      popup.isLoading = false;
    },
    async getTagQuiz(obj: Bank): Promise<void> {
      const bankID = obj.ID;
      const url =
        process.env.VUE_APP_BASE_URL + process.env.VUE_APP_GET_TAG_QUIZ;
      const params = new FormData();
      params.append("BankQuizID", bankID);
      const response = await axios.post(url, params, {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI1ZDgwOGUyZWNmOWE4MjFiZGM5ZGFmODEiLCJlbWFpbCI6InZpZXRwaHVuZy5pdEBnbWFpbC5jb20iLCJ1bmlxdWVfbmFtZSI6IlBodW5nIER1YyBWaWV0Iiwicm9sZSI6InRlYWNoZXIiLCJUeXBlIjoidGVhY2hlciIsIkNoZWNrIjoiWmRQNEVqIiwibmJmIjoxNzA1NjU2MzU0LCJleHAiOjE3MzcyNzg3NTQsImlhdCI6MTcwNTY1NjM1NH0.m4eJjNsUUEJm9WNiEqicnjrrLW8a8h9qYyRX6At1FQs`,
        },
      });
      if (response) {
        obj.Tags = response.data.Data;
      }
    },
    async getListPart(bank: Bank, tag: Tag): Promise<Array<PartQuestion>> {
      const bankID = bank.ID;
      const tagID = tag.ID;
      const url =
        process.env.VUE_APP_BASE_URL + process.env.VUE_APP_GET_LIST_PART_BY_TAG;
      const params = new FormData();
      params.append("StoreID", bankID);
      params.append("TagID", tagID);
      const response = await axios.post(url, params, {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI1ZDgwOGUyZWNmOWE4MjFiZGM5ZGFmODEiLCJlbWFpbCI6InZpZXRwaHVuZy5pdEBnbWFpbC5jb20iLCJ1bmlxdWVfbmFtZSI6IlBodW5nIER1YyBWaWV0Iiwicm9sZSI6InRlYWNoZXIiLCJUeXBlIjoidGVhY2hlciIsIkNoZWNrIjoiWmRQNEVqIiwibmJmIjoxNzA1NjU2MzU0LCJleHAiOjE3MzcyNzg3NTQsImlhdCI6MTcwNTY1NjM1NH0.m4eJjNsUUEJm9WNiEqicnjrrLW8a8h9qYyRX6At1FQs`,
        },
      });
      if (response) {
        return response.data.Data;
      } else {
        return [];
      }
    },
  },
});
